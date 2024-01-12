// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import Header from '@/features/Header/Header';
import React from 'react';

export const metadata = {
  title: '機能要望 - TAGether',
};

export default function RootLayout({children}: {children: React.ReactNode}): JSX.Element {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
