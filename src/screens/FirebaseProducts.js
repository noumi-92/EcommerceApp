import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

// modular API
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from '@react-native-firebase/firestore';

const db = getFirestore();
const productsRef = collection(db, 'products');

const FirebaseProducts = () => {
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // READ (Real-time listener)
  useEffect(() => {
    const unsubscribe = onSnapshot(
      productsRef,
      (querySnapshot) => {
        const productList = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setProducts(productList);
        setLoading(false);
      },
      (error) => {
        Alert.alert('Error', error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // CREATE & UPDATE
  const handleSaveProduct = async () => {
    const trimmedTitle = title.trim();
    const trimmedPrice = price.trim();
    const parsedPrice = parseFloat(trimmedPrice);

    if (!trimmedTitle || !trimmedPrice) {
      Alert.alert('Validation Error', 'Please enter both title and price.');
      return;
    }

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      Alert.alert('Validation Error', 'Please enter a valid, non-negative price.');
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), {
          title: trimmedTitle,
          price: parsedPrice,
        });
        setEditingId(null);
      } else {
        await addDoc(productsRef, {
          title: trimmedTitle,
          price: parsedPrice,
          createdAt: serverTimestamp(),
        });
      }

      setTitle('');
      setPrice('');
    } catch (error) {
      Alert.alert('Error saving product', error.message);
    }
  };

  // EDIT PREPARATION
  const handleEdit = (product) => {
    setTitle(product.title);
    setPrice(product.price !== undefined && product.price !== null ? product.price.toString() : '');
    setEditingId(product.id);
  };

  // CANCEL EDIT
  const handleCancelEdit = () => {
    setTitle('');
    setPrice('');
    setEditingId(null);
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      if (id === editingId) {
        handleCancelEdit();
      }
    } catch (error) {
      Alert.alert('Error deleting product', error.message);
    }
  };

  // RENDER ITEM
  const renderProductItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>
          ${typeof item.price === 'number' && !isNaN(item.price) ? item.price.toFixed(2) : '0.00'}
        </Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product Management</Text>

      {/* FORM */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Product Title"
          placeholderTextColor="#8e8e93"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Product Price"
          placeholderTextColor="#8e8e93"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        <TouchableOpacity
          style={[styles.saveBtn, editingId && styles.updateBtn]}
          onPress={handleSaveProduct}
        >
          <Text style={styles.saveBtnText}>
            {editingId ? 'Update Product' : 'Add Product'}
          </Text>
        </TouchableOpacity>

        {editingId && (
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelEdit}>
            <Text style={styles.cancelBtnText}>Cancel Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* LIST */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products available.</Text>
          }
        />
      )}
    </View>
  );
};

export default FirebaseProducts;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#1c1c1e' },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
    color: '#1c1c1e',
    placeholderTextColor: '#8e8e93',
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  updateBtn: { backgroundColor: '#34C759' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  cancelBtn: {
    backgroundColor: '#8e8e93',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelBtnText: { color: '#fff', fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  cardInfo: { flex: 1 },
  productTitle: { fontSize: 16, fontWeight: 'bold', color: '#1c1c1e' },
  productPrice: { fontSize: 14, color: '#34C759', marginTop: 4, fontWeight: '600' },
  cardActions: { flexDirection: 'row', gap: 8 },
  editBtn: {
    backgroundColor: '#FF9500',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteBtn: {
    backgroundColor: '#FF3B30',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  emptyText: { textAlign: 'center', color: '#8e8e93', marginTop: 20 },
});