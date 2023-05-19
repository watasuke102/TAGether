// TAGether - Share self-made exam for classmates
// Header.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
//
import css from './Header.module.scss';
import Router from 'next/router';
import React from 'react';
import Button from '@/common/Button/Button';
import ButtonInfo from '@mytypes/ButtonInfo';

export default function Header(): React.ReactElement {
  // prettier-ignore
  const info: ButtonInfo[] = [
    { text: 'TAGether',     icon: 'tagether',           OnClick: () => Router.push('/'),        type: 'icon_desc' },
    { text: 'カテゴリ一覧', icon: 'fas fa-book',        OnClick: () => Router.push('/list'),    type: 'icon_desc' },
    { text: 'タグ一覧',     icon: 'fas fa-tag',         OnClick: () => Router.push('/tag'),     type: 'icon_desc' },
    { text: 'プロフィール', icon: 'fas fa-user',        OnClick: () => Router.push('/profile'), type: 'icon_desc' },
    { text: '機能要望',     icon: 'fas fa-comment-alt', OnClick: () => Router.push('/request'), type: 'icon_desc' },
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
