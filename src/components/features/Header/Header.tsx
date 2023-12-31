// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './Header.module.scss';
import React from 'react';
import Link from 'next/link';

export default function Header(): React.ReactElement {
  // prettier-ignore
  const info = [
    {href: '/'       , icon: 'tagether',           text: 'TAGether'},
    {href: '/list'   , icon: 'fas fa-book',        text: 'カテゴリ一覧'},
    {href: '/tag'    , icon: 'fas fa-tag',         text: 'タグ一覧'},
    {href: '/profile', icon: 'fas fa-user',        text: 'プロフィール'},
    {href: '/request', icon: 'fas fa-comment-alt', text: '機能要望'},
  ];

  return (
    <header className={css.header}>
      {info.map(e => (
        <Link href={e.href} className={css.item} key={e.text}>
          <div className={css.icon_wrapper}>
            <span className={`${css.icon} ${e.icon === 'tagether' ? css.tagether : e.icon}`} />
          </div>
          <span className={css.text}>{e.text}</span>
        </Link>
      ))}
    </header>
  );
}
