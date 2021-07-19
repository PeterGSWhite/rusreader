import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';

import { Provider } from 'react-redux'

import Library from './screens/Library';
import Settings from './screens/Settings';
import PageContainer from './screens/PageContainer';
import Chapters from './screens/Chapters';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { PersistGate } from 'redux-persist/integration/react'

import configureStore from './redux/store'
const {store, persistor} = configureStore();

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Library" component={Library} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="PageContainer" component={PageContainer} />
      <Drawer.Screen name="Chapters" component={Chapters} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store} persistor={persistor}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <MyDrawer />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}