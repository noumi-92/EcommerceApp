import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const StudentsFlatList  = () => {
  const students = [
    { id: '1', name: 'Ali', course: 'React Native' },
    { id: '2', name: 'Sara', course: 'JavaScript' },
    { id: '3', name: 'Ahmed', course: 'Mobile UI' },
  ];
  //Display using FlatList to render the list of students
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Student Directory</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentCard}>
            <Text style={styles.name}>Name: {item.name}</Text>
            <Text style={styles.course}>Course: {item.course}</Text>
          </View>
        )}
      />
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  studentCard: {
    backgroundColor: '#d7dac5',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  course: {
    fontSize: 16,
    color: '#666',
  },
});

export default StudentsFlatList;
