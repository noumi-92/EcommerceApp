import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const PRODUCTS = Array.from({ length: 30 }, (_, i) => ({
  id: String(i + 1),
  name: `Product Item #${i + 1}`,
  price: `$${(i + 1) * 15}`,
}));

const ProductFeedScreen = () => {
  const [filter, setFilter] = useState('All');

  // 1. Ref for Native FlatList component (imperative scrolling)
  const listRef = useRef(null);

  // 2. Ref to hold timer ID across re-renders without triggering extra UI updates
  const checkoutTimerRef = useRef(null);

  const applyCategoryFilter = (category) => {
    setFilter(category);
    
    // Scroll back to top instantly when filter changes
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const startHoldCartTimer = () => {
    if (checkoutTimerRef.current) clearInterval(checkoutTimerRef.current);

    console.log('Cart reserved for 10 minutes...');
    // Store timer ID directly in ref
    checkoutTimerRef.current = setTimeout(() => {
      alert('Cart reservation expired!');
    }, 600000);
  };

  return (
    <View style={styles.container}>
      {/* Category Filter Buttons */}
      <View style={styles.filterRow}>
        <TouchableOpacity 
          style={styles.filterBtn} 
          onPress={() => applyCategoryFilter('Shoes')}
        >
          <Text style={styles.filterText}>Filter Shoes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cartBtn} 
          onPress={startHoldCartTimer}
        >
          <Text style={styles.cartText}>Reserve Items</Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        ref={listRef}
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  filterBtn: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8 },
  cartBtn: { backgroundColor: '#34C759', padding: 10, borderRadius: 8 },
  filterText: { color: '#fff', fontWeight: 'bold' },
  cartText: { color: '#fff', fontWeight: 'bold' },
  productCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  productName: { fontSize: 16, fontWeight: '600' },
  productPrice: { fontSize: 14, color: '#FF3B30', marginTop: 4 },
});

export default ProductFeedScreen;