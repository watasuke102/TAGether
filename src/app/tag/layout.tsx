// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import React from 'react';
import Header from '@/features/Header/Header';
import {require_session_or_redirect} from '@utils/RequireSessionOrRedirect';

export const metadata = {
  title: 'タグ一覧 - TAGether',
};

export default async function RootLayout({children}: {children: React.ReactNode}): Promise<JSX.Element> {
  await require_session_or_redirect();
  return (
    <>
      <Header />
      {children}
    </>
  );
}
