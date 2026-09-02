import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter App</Text>
      <Text style={styles.countText}>{count}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Increase" onPress={() => setCount(count + 1)} />
        <Button title="Decrease" onPress={() => setCount(count - 1)} color="red" />
        <Button title="Reset" onPress={() => setCount(0)} color="gray" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  countText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default Counter;