import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';

const PostApi = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [message, setMessage] = useState('Hello, this is a test message.');

  // Plain JavaScript State Management (No TypeScript annotations)
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const handleSubmit = async () => {
    // Basic Form Validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    setResponseData(null);

    try {
      // Replace with your actual API endpoint
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        setResponseData(json);
        Alert.alert('Success', 'Data posted successfully!');
      } else {
        Alert.alert('Error', 'Failed to submit data.');
      }
    } catch (error) {
      console.error('POST Error:', error);
      Alert.alert('Network Error', 'Something went wrong while submitting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Message</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor="#8e8e93"
      />

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#8e8e93"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        value={message}
        onChangeText={setMessage}
        placeholder="Message"
        placeholderTextColor="#8e8e93"
        multiline={true}
        numberOfLines={4}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>

      {responseData && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseTitle}>Server Response:</Text>
          <Text style={styles.responseText}>ID: {responseData.id}</Text>
          <Text style={styles.responseText}>Name: {responseData.name}</Text>
          <Text style={styles.responseText}>Email: {responseData.email}</Text>
          <Text style={styles.responseText}>Message: {responseData.message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1c1c1e',
  },
  input: {
    width: '100%',
    height: 44,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 12,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#1c1c1e',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 4,
  },
  disabledButton: {
    backgroundColor: '#a0c7ff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  responseContainer: {
    marginTop: 24,
    width: '100%',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  responseText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
});

export default PostApi;