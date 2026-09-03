import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import StudentDirectory from '../screens/StudentDirectory';
import Counter from '../screens/Counter';
import StudentsFlatList from '../screens/StudentsFlatList';
import ReactHooks from '../screens/ReactHooks';
import UseRef from '../screens/UseRef';
import APICalls from '../screens/APICalls';

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'React Native Examples' }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Student Search' }}
      />
      <Stack.Screen
        name="StudentDirectory"
        component={StudentDirectory}
        options={{ title: 'Student Directory' }}
      />
      <Stack.Screen
        name="Counter"
        component={Counter}
        options={{ title: 'Counter App' }}
      />
      <Stack.Screen
        name="StudentsFlatList"
        component={StudentsFlatList}
        options={{ title: 'Student Directory' }}
      />
      <Stack.Screen
        name="ReactHooks"
        component={ReactHooks}
        options={{ title: 'React Hooks Examples' }}
      />
      <Stack.Screen
        name="UseRef"
        component={UseRef}
        options={{ title: 'useRef Example' }}
      />
      <Stack.Screen
        name="APICalls"
        component={APICalls}
        options={{ title: 'API Calls' }}
      />
    </Stack.Navigator>

  );
};

export default RootStack;