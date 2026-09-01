import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from './src/screens/SearchScree';
import StudentDirectory from './src/screens/StudentDirectory';

const Stack = createNativeStackNavigator();

// List of features on your main app screen
const MENU_ITEMS = [
  { id: '1', title: 'Search Students', screen: 'Search' },
  { id: '2', title: 'Student Directory', screen: 'StudentDirectory' },
  { id: '3', title: 'Settings', screen: null },
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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Main Menu' }} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Student Search' }} />
        <Stack.Screen name="StudentDirectory" component={StudentDirectory} options={{ title: 'Student Directory' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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