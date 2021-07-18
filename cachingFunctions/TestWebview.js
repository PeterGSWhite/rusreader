import React, { useState } from 'react';
import { StyleSheet, StatusBar, SafeAreaView, TextInput, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const TestWebView = ({fontSize, wordSpacing, setFontWidth, width}) => {
    
    const quickBrownFox = `
    <html>
      <head>
        <style type="text/css">   
          @font-face {
            font-family: 'Droid Sans Mono';
            src: url('file:///android_asset/fonts/DroidSansMono.ttf');
          }
        </style>
        <style>p {font-size: ${fontSize}; font-family: "Droid Sans Mono"; word-spacing: ${wordSpacing} }</style>
      </head>
    <body>
    <p>rendered char  width: ${width}</p>
    <p>The Quick Brown Fox Jumps Over The Lazy Dog.</p>
    <p>Съешь Же Ещё Этих Мягких Французских Булок Да Выпей Чаю.</p>
    <p>0123456789!"№;%:?*()_+=-£$&,.'~</p>
    </body></html>`

    const runFirst = `
      function displayTextWidth(text, font) {
        let canvas = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"));
        let context = canvas.getContext("2d");
        context.font = font;
        let metrics = context.measureText(text);
        return metrics.width;
      }
      let textWidth = displayTextWidth('a', "${fontSize}px 'Droid Sans Mono'")
      let spaceWidth = displayTextWidth(' ', "${fontSize}px 'Droid Sans Mono'")
      
      window.ReactNativeWebView.postMessage(textWidth + ',' + spaceWidth);
      true;
    `
    return (
        <WebView
            originWhitelist={['*']}
            onMessage={(event) => {
                let atts = event.nativeEvent.data.split(',')
                setFontWidth({fontWidth: parseFloat(atts[0]).toFixed(2), spaceWidth: parseFloat(atts[1]).toFixed(2)});
            }}
            source={{ html: quickBrownFox, baseUrl: '' }} 
            injectedJavaScript={runFirst}
            scalesPageToFit={false}
        />
    )
}

export default TestWebView