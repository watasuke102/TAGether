// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import React from 'react';
import '@/common/main.scss';
import '@/common/nprogress.css';
import Header from '../components/features/Header/Header';

export const metadata = {
  title: 'TAGether',
};

export default function RootLayout({children}: {children: React.ReactNode}): JSX.Element {
  return (
    <html lang='ja'>
      <head>
        <link rel='icon' href='/static/icon.ico' />
        <link rel='apple-touch-icon' href='/static/icon-maskable.png' sizes='480x480' />
        <link rel='manifest' href='/manifest.json' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link href='https://fonts.googleapis.com/css2?family=M+PLUS+1p&display=swap' rel='stylesheet' />
      </head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
