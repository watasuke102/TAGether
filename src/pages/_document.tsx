// TAGether - Share self-made exam for classmates
// _document.tsx
//
// CopyRight (c) 2020 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class Doc extends Document {
  render() {
    return (
      <Html lang="ja">
      <Head>
        <meta charSet="utf8"></meta>
        <link href="https://use.fontawesome.com/releases/v5.15.1/css/all.css" rel="stylesheet"></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
      </Html>
    )
  }
}