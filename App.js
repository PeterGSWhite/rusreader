import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import Library from './screens/Library';

import { Provider } from 'react-redux'
import PageContainer from './screens/PageContainer';

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
      <Drawer.Screen name="PageContainer" component={PageContainer} />
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