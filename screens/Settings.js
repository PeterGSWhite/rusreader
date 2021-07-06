import React, { useState } from 'react';
import { StyleSheet, StatusBar, SafeAreaView, TextInput, Text, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import TestWebView from '../cachingFunctions/TestWebview'

const Settings = ({navigation}) => {
    const dispatch = useDispatch()
    const settings = useSelector(state => state.settings)

    const setFontWidth = ({fontWidth, spaceWidth}) => {
        dispatch({
            type: 'settings/edit',
            payload: {
                fontWidth: fontWidth,
                realWordSpacing: spaceWidth
            }
        })
    }

    return (
    <View style= {{flex: 1}}>
        <Text style={styles.label}>Font Size</Text>
        <TextInput
            style={styles.input}
            label="Font Size"
            onChangeText={(s) => {dispatch({type: 'settings/edit', payload: {fontSize: s}})}}
            value={settings.fontSize.toString()}
            keyboardType="numeric"
        />
        <Text style={styles.label}>Word Spacing</Text>
        <TextInput
            style={styles.input}
            label="Word Spacing"
            onChangeText={(s) => {dispatch({type: 'settings/edit', payload: {wordSpacing: s}})}}
            value={settings.wordSpacing.toString()}
            keyboardType="numeric"
        />
        <Text style={styles.label}>Line Spacing</Text>
        <TextInput
            style={styles.input}
            label="Line Spacing"
            onChangeText={(s) => {dispatch({type: 'settings/edit', payload: {lineSpacing: s}})}}
            value={settings.lineSpacing.toString()}
            keyboardType="numeric"
        />
        <Text style={styles.label}>Horizontal Margin</Text>
        <TextInput
            style={styles.input}
            label="Horizontal Margin"
            onChangeText={(s) => {dispatch({type: 'settings/edit', payload: {pageMarginHorizontal: s}})}}
            value={settings.pageMarginHorizontal.toString()}
            keyboardType="numeric"
        />
        <Text style={styles.label}>Vertical Margin</Text>
        <TextInput
            style={styles.input}
            label="Vertical Margin"
            onChangeText={() => {(s) => {dispatch({type: 'settings/edit', payload: {pageMarginVertical: s}})}}}
            value={settings.pageMarginVertical.toString()}
            keyboardType="numeric"
        />

        {/* Put a webview here with a callback function to calculate font-width based on font-size. Use the opportunity to render example sentence? */}
        <TestWebView
            fontSize={settings.fontSize}
            wordSpacing={settings.wordSpacing}
            setFontWidth={setFontWidth}
            width={settings.fontWidth}
            spacewidth={settings.realWordSpacing}
        />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 0,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 2,
  },
  label: {
    fontSize: 20, 
    marginHorizontal: 15,
  }
});

export default Settings;