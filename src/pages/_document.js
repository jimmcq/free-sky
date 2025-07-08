import Document, { Html, Head, Main, NextScript } from 'next/document'

// Global styles for smooth scrolling and better typography
const globalStyles = `
html, body, #__next {
  -webkit-overflow-scrolling: touch;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
#__next {
  display: flex;
  flex-direction: column;
  height: 100%;
}
html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}
body {
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior-y: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -ms-overflow-style: scrollbar;
  margin: 0;
  padding: 0;
}
* {
  box-sizing: border-box;
}
p, div {
  margin-top: 0;
  margin-bottom: 0;
}
a {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
`

export default class MyDocument extends Document {
    render() {
        return (
            <Html style={{ height: '100%' }}>
                <Head>
                    <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
                </Head>
                <body style={{ height: '100%', overflow: 'hidden' }}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
