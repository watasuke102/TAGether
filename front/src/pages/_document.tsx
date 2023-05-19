// TAGether - Share self-made exam for classmates
// _document.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
//
import Document, {Html, Head, Main, NextScript} from 'next/document';
import React from 'react';

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
