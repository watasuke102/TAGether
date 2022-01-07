// TAGether - Share self-made exam for classmates
// _document.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react';
import Document, {Html, Head, Main, NextScript} from 'next/document';

export default class Doc extends Document {
  render(): React.ReactElement {
    return (
      <Html lang='ja'>
        <Head>
          <meta charSet='utf8' />
          <link rel='icon' href='/static/icon.ico' />
          <link rel='manifest' href='/manifest.json' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
