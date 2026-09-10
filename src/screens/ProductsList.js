import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const ProductsList = () => {
  // 1. UI States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Function to fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://dummyjson.com/products');

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();

      // Important: Extract the `products` array from the returned JSON object
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // 4. Loading State
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // 5. Error State
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchProducts}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 6. Products List View
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product Catalog</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Product Thumbnail */}
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.productImage}
              resizeMode="cover"
            />

            {/* Product Details */}
            <View style={styles.cardContent}>
              <Text style={styles.productName} numberOfLines={1}>
                {item.title}
              </Text>

              <Text style={styles.productRating}>
                ★ {item.rating ? item.rating.toFixed(1) : 'N/A'}
              </Text>

              <Text style={styles.productPrice}>
                ${item.price ? item.price.toFixed(2) : '0.00'}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: { fontSize: 22, fontWeight: 'bold', color: '#1c1c1e', marginBottom: 16 },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryBtn: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryBtnText: { color: '#fff', fontWeight: '600' },

  /* Card Layout */
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f2f2f7',
  },
  cardContent: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1c1c1e',
  },
  productRating: {
    fontSize: 13,
    color: '#FF9500',
    fontWeight: '600',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#34C759',
    marginTop: 4,
  },
});

export default ProductsList;