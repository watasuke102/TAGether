// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import React from 'react';
import '@/common/main.scss';
import '@/common/nprogress.css';
import {Toast, ToastProvider} from '@/common/Toast/Toast';
import {getIronSession} from 'iron-session';
import {cookies} from 'next/headers';
import {Session} from '@mytypes/Session';
import {env} from 'env';
import Header from '@/features/Header/Header';

export const metadata = {
  title: 'TAGether',
};

export default async function RootLayout({children}: {children: React.ReactNode}): Promise<JSX.Element> {
  const session = await getIronSession<Session>(cookies(), env.SESSION_OPTION);
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
        <ToastProvider>
          {session && <Header />}
          {children}
          <Toast />
        </ToastProvider>
      </body>
    </html>
  );
}
