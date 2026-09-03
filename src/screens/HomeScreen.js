import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const MENU_ITEMS = [
  { id: '1', title: 'Search Students', screen: 'Search' },
  { id: '2', title: 'Student Directory', screen: 'StudentDirectory' },
  { id: '3', title: 'Counter', screen: 'Counter' },
  { id: '4', title: 'Students FlatList', screen: 'StudentsFlatList' },
    { id: '5', title: 'React Hooks Examples', screen: 'ReactHooks' },
    { id: '6', title: 'useRef Example', screen: 'UseRef' },
  { id: '7', title: 'API Calls', screen: 'APICalls' },
];

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={MENU_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => item.screen && navigation.navigate(item.screen)}
          >
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default HomeScreen;