import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Debounce search by 500ms to reduce unnecessary API requests
    const timer = setTimeout(() => {
      if (query.trim() !== '') {
        onSearch(query);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Search Student:</Text>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Type student name..."
        placeholderTextColor="#888"
      />
      {query !== '' && (
        <Text style={styles.resultText}>Searching for: {query}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  resultText: {
    marginTop: 12,
    fontSize: 14,
    color: '#007AFF',
  },
});

export default SearchBar;