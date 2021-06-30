import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useState } from 'react/cjs/react.development';

const MyWeb = ({section, styles, fontSize, setPixelWidth}) => {
    const runFirst = `
      function displayTextWidth(text, font) {
        let canvas = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"));
        let context = canvas.getContext("2d");
        context.font = font;
        let metrics = context.measureText(text);
        return metrics.width;
      }
      window.ReactNativeWebView.postMessage(displayTextWidth(' ', "${fontSize}px 'Droid Sans Mono'"));
      true;
    `; // 5.5322 12.827 2.7636 2.48046 16.1230
    const startHtml = `<html>
    <head>
      <style type="text/css">   
      @font-face {
        font-family: 'Droid Sans Mono';
        src: url('file:///android_asset/fonts/DroidSansMono.ttf');
      }
`
    const styleSeperator = `</style>
    </head>
    <body>`
    const endHtml = `</body>
    </html>`
    return (
      <WebView
        originWhitelist={['*']}
        onMessage={(event) => {
          setPixelWidth(parseFloat(event.nativeEvent.data).toFixed(2));
        }}
        source={{ html: startHtml + styles + styleSeperator + section + endHtml, baseUrl: '' }} 
        injectedJavaScript={runFirst}
        scalesPageToFit={false}
      />
    );
}

export default MyWeb