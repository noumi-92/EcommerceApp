import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import SearchBar from '../components/SearchBar';

const SearchScreen = () => {
  const handleSearch = useCallback((searchTerm) => {
    console.log(`Searching database for: ${searchTerm}`);
    // Place API request here
  }, []);

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default SearchScreen;