// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {require_session_or_redirect} from '@utils/RequireSessionOrRedirect';
import React from 'react';

export const metadata = {
  title: 'タグ一覧 - TAGether',
};

export default async function RootLayout({children}: {children: React.ReactNode}): Promise<JSX.Element> {
  await require_session_or_redirect();
  return <>{children}</>;
}
