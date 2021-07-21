import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';

import { Provider } from 'react-redux'

import Library from './screens/Library';
import Settings from './screens/Settings';
import PageContainer from './screens/PageContainer';
import Chapters from './screens/Chapters';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import store from './redux/store'


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

export default () => {
  return (
    <Provider store={store} >
        <NavigationContainer>
          <MyDrawer />
        </NavigationContainer>
    </Provider>
  );
};
