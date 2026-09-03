import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import React, { useState, useEffect } from 'react'

const APICalls = () => {
    // 1. UI States for re-rendering
    // 1-1. State to hold fetched products
    const [products, setProducts] = useState([]);
    // 1-2. State to track loading status
    const [loading, setLoading] = useState(true);
    // 1-3. State to track any errors during API call
    const [error, setError] = useState(null);

    // 2. Fetch products from API on component mount
    useEffect(() => {
        // Track if component is still mounted
        let isMounted = true; 
        // Async function to fetch products
        const fetchProducts = async () => {
            // Reset states before fetching
            try{
                // Set loading state and clear previous errors
                setLoading(true);
                // Clear any previous error messages
                setError(null);
                // Fetch products from the API
                const response = await fetch('https://dummyjson.com/products?limit=10');
                // Check if the response is successful
                if(!response.ok){
                    throw new Error('Failed to fetch products');
                }
                // Parse the JSON data from the response
                const data = await response.json();
                alert('API call successful! Check console for product data. No of products fetched: ' + data.products.length);
                console.log('Fetched Products:', data.products);
                // Update products state only if component is still mounted
                if(isMounted) {
                    setProducts(data.products);
                }
            // Handle any errors that occur during the fetch
            }catch (error){
                // Update error state only if component is still mounted
                if (isMounted) {
                    // Set error message for display
                    setError(error.message || 'Something went wrong');
                }
            // Ensure loading state is updated regardless of success or failure
            }finally{
                if(isMounted) {
                    // Set loading state to false after fetch attempt
                    setLoading(false);
                }
            }
        };
        // Call the fetch function to initiate the API request
        fetchProducts();
        // Cleanup function to set isMounted to false when component unmounts
        return () => {
            // Prevent state updates on unmounted component
            isMounted = false;
        };
    }, []);
    // 3. Conditional rendering based on loading and error states
    if (loading) {
        // Show a loading spinner while data is being fetched
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }
    // 4. Display error message if API call fails
    if(error){
        // Show an error message if there was an issue fetching data
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }
    // 5. Render the list of products once data is successfully fetched
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Product List</Text>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            <Text style={styles.productTitle}>{item.title}</Text>
                            <Text style={styles.productBrand}>{item.brand}</Text>
                            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity style={styles.buyBtn} onPress={() => alert(`Purchased ${item.title} for $${item.price.toFixed(2)}`)}>
                            <Text style={styles.buyBtnText}>Buy Now</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    )
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#1c1c1e' },
  infoText: { marginTop: 12, color: '#666', fontSize: 16 },
  errorText: { color: '#FF3B30', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  cardContent: { flex: 1, marginRight: 12 },
  productTitle: { fontSize: 16, fontWeight: 'bold', color: '#3a3a3c' },
  productBrand: { fontSize: 13, color: '#8e8e93', marginTop: 2 },
  productPrice: { fontSize: 15, fontWeight: '600', color: '#34C759', marginTop: 6 },
  buyBtn: { backgroundColor: '#007AFF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  buyBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
});

export default APICalls