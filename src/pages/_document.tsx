import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class Doc extends Document {
  render() {
    return (
      <Html lang="ja">
      <Head>
        <meta charSet="utf8"></meta>
      </Head>
      <body>
        <Main />
        <NextScript />
        </body>
      </Html>
    )
  }
}