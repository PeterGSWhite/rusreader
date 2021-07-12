import React, {useEffect} from 'react';
import { WebView } from 'react-native-webview';
import { useSelector } from 'react-redux' 
import Tts from 'react-native-tts';
import { BackHandler } from 'react-native';
Tts.setDefaultLanguage('ru_RU');

const PageContent = ({pageContent}) => {
    
    const settings = useSelector(state => state.settings)

    useEffect(() => console.log('page content ccc', pageContent) , [pageContent,])

    const handleWebviewEvent = (event) => {
        let parts = event.nativeEvent.data.split('/')
        if(parts[0] === 'speak') { 
            speakSentence(parts[1]);
        }
    }

    const speakSentence = (sentence) => {
        Tts.stop()
        Tts.speak(sentence);
      }

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
        .sv {
            background-color: rgba(0, 0, 255, 0.4);;
        }
        .nsv {
            background-color: rgba(255, 0, 0, 0.4);
        }
        .nsv-ud {
            background-color: rgba(0, 255, 0, 0.4);;
        }
        .nsv-md {
            background-color: rgba(120, 120, 120, 0.4);;
        }
        .highlighted {
            background-color: transparent;
        }
    </style>`
    
    const html = `<html>
    <head>${styles}</head>
    <body>
      <script>
        function toggleHighlight(event, element) {
            event.stopPropagation();
          element.classList.toggle('highlighted');
        }
      </script>
      <div class="page-container">${pageContent}</div>
    </body>
    </html>`

    const runFirst = `
    true; // note: this is required, or you'll sometimes get silent failures
    `;

    return (
        <WebView
          originWhitelist={['*']}
          source={{ html: html }} 
          scalesPageToFit={false}
          onMessage={(event) => {
            handleWebviewEvent(event)
          }}
          injectedJavaScript={runFirst}
        />
    );
}

export default PageContent