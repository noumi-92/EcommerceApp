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
import APIUserProfile from '../screens/APIUserProfile';
import FirebaseProducts from '../screens/FirebaseProducts';
import PostsList from '../screens/PostsList';
import ProductsList from '../screens/ProductsList';
import UsersListScreen from '../screens/UsersListScreen';
import PostApi from '../screens/PostApi';
import MediaPost from '../screens/MediaPost';

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
      <Stack.Screen
        name="APIUserProfile"
        component={APIUserProfile}
        options={{ title: 'API User Profile' }}
      />
      <Stack.Screen
        name="FirebaseProducts"
        component={FirebaseProducts}
        options={{ title: 'Firebase Products' }}
      />
      <Stack.Screen
        name="PostsList"
        component={PostsList}
        options={{ title: 'Posts List' }}
      />
      <Stack.Screen
        name="ProductsList"
        component={ProductsList}
        options={{ title: 'Product Catalog' }}
      />
      <Stack.Screen
        name="UsersList"
        component={UsersListScreen}
        options={{ title: 'Users List' }}
      />
      <Stack.Screen
        name="PostApi"
        component={PostApi}
        options={{ title: 'Post API' }}
      />
      <Stack.Screen
        name="MediaPost"
        component={MediaPost}
        options={{ title: 'Media Post' }}
      />
    </Stack.Navigator>

  );
};

export default RootStack;