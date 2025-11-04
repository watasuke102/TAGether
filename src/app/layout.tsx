// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import React from 'react';
import '@/common/main.scss';
import { Toast, ToastProvider } from '@/common/Toast/Toast';

export const metadata = {
  title: 'TAGether',
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang='ja'>
      <head>
        <link rel='icon' href='/static/icon.ico' />
        <link rel='apple-touch-icon' href='/static/icon-maskable.png' sizes='480x480' />
        <link rel='manifest' href='/manifest.json' />
      </head>
      <body>
        <ToastProvider>
          {children}
          <Toast />
        </ToastProvider>
      </body>
    </html>
  );
}
