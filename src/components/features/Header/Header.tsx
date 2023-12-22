// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './Header.module.scss';
import React from 'react';
import Button from '@/common/Button/Button';
import ButtonInfo from '@mytypes/ButtonInfo';
import {useRouter} from 'next/navigation';

export default function Header(): React.ReactElement {
  const router = useRouter();
  // prettier-ignore
  const info: ButtonInfo[] = [
    { text: 'TAGether',     icon: 'tagether',           OnClick: () => router.push('/'),        type: 'icon_desc' },
    { text: 'カテゴリ一覧', icon: 'fas fa-book',        OnClick: () => router.push('/list'),    type: 'icon_desc' },
    { text: 'タグ一覧',     icon: 'fas fa-tag',         OnClick: () => router.push('/tag'),     type: 'icon_desc' },
    { text: 'プロフィール', icon: 'fas fa-user',        OnClick: () => router.push('/profile'), type: 'icon_desc' },
    { text: '機能要望',     icon: 'fas fa-comment-alt', OnClick: () => router.push('/request'), type: 'icon_desc' },
  ];

  return (
    <header className={css.header}>
      <div className={css.buttons}>
        {info.map(e => (
          <Button key={`headerbutton_${e.text}`} {...e} />
        ))}
      </div>
    </header>
  );
}
