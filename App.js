import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import Library from './screens/Library';

import { Provider } from 'react-redux'
import Test from './screens/Test';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { configureStore } from '@reduxjs/toolkit'

import bookReducer from './redux/booksSlice'

const store = configureStore({
  reducer: {
    books: bookReducer,
  }
})

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Library" component={Library} />
      <Drawer.Screen name="Test" component={Test} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MyDrawer />
      </NavigationContainer>
    </Provider>
  );
}