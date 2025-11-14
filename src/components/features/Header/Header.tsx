// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './Header.module.scss';
import TAGetherIcon from 'public/static/icon.svg';
import ListIcon from '@assets/list.svg';
import TagIcon from '@assets/tag.svg';
import ProfileIcon from '@assets/profile.svg';
import RequestIcon from '@assets/request.svg';
import Link from 'next/link';
import React from 'react';

export default function Header(): React.ReactElement {
  // prettier-ignore
  const info = [
    {href: '/'       , icon: <TAGetherIcon />, text: 'TAGether'    },
    {href: '/list'   , icon: <ListIcon />    , text: 'カテゴリ一覧'},
    {href: '/tag'    , icon: <TagIcon />     , text: 'タグ一覧'    },
    {href: '/request', icon: <RequestIcon /> , text: '機能要望'    },
    {href: '/profile', icon: <ProfileIcon /> , text: 'アカウント'},
  ];

  return (
    <header className={css.header}>
      {info.map(e => (
        <Link href={e.href} className={css.item} key={e.text}>
          <div className={css.icon}>{e.icon}</div>
          <span className={css.text}>{e.text}</span>
        </Link>
      ))}
    </header>
  );
}
