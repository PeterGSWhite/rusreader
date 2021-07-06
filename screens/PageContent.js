import React from 'react';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux' 

const PageContent = ({pageContent}) => {
    
    const settings = useSelector(state => state.settings)

    const styles = `<style>
        p {
            font-size: ${settings.fontSize}px;
            word-spacing: ${settings.wordSpacing}px;
            margin: ${settings.lineSpacing}px;
        }
        .page-container {
            margin-left: ${settings.pageMarginHorizontal}px;
            margin-right: ${settings.pageMarginHorizontal}px;
            margin-top: ${settings.pageMarginVertical}px;
            margin-bottom: ${settings.pageMarginVertical}px;
            word-break: break-all;
        }
    </style>`

    const html = `<html><head>${styles}</head><body><div class="page-container">${pageContent}</div></body></html>`

    return (
        <WebView
          originWhitelist={['*']}
          source={{ html: html }} 
          scalesPageToFit={false}
        />
    );
}

export default PageContent