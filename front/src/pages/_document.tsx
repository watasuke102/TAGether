// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import Document, {Html, Head, Main, NextScript} from 'next/document';
import React from 'react';

export default class Doc extends Document {
  render(): React.ReactElement {
    return (
      <Html lang='ja'>
        <Head>
          <meta charSet='utf8' />
          <link rel='icon' href='/static/icon.ico' />
          <link rel='apple-touch-icon' href='/static/icon-maskable.png' sizes='480x480' />
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
