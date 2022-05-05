// TAGether - Share self-made exam for classmates
// Header.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './Header.module.scss';
import Router from 'next/router';
import React from 'react';
import Button from '@/common/Button/Button';
import ButtonInfo from '@mytypes/ButtonInfo';

export default function Header(): React.ReactElement {
  const [isFixedButtons, SetIsFixedButtons] = React.useState(false);

  const onScroll = (): void => {
    if (!process.browser) return;
    SetIsFixedButtons(window.pageYOffset > 70);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', onScroll, true);
    return () => window.removeEventListener('scroll', onScroll, true);
  }, []);

  function ButtonContainersCSS(): string {
    if (!isFixedButtons) return css.buttons_container;
    return css.buttons_container_fixed;
  }

  // prettier-ignore
  const info: ButtonInfo[] = [
    { text: 'ホーム',       icon: 'fas fa-home',        onClick: () => Router.push('/'),        type: 'icon_desc' },
    { text: 'カテゴリ一覧', icon: 'fas fa-book',        onClick: () => Router.push('/list'),    type: 'icon_desc' },
    { text: 'タグ一覧',     icon: 'fas fa-tag',         onClick: () => Router.push('/tag'),     type: 'icon_desc' },
    { text: 'プロフィール', icon: 'fas fa-user',        onClick: () => Router.push('/profile'), type: 'icon_desc' },
    { text: '機能要望',     icon: 'fas fa-comment-alt', onClick: () => Router.push('/request'), type: 'icon_desc' },
  ];

  return (
    <header className={css.header}>
      <h1>TAGether</h1>
      <nav className={ButtonContainersCSS()}>
        <div className={css.buttons}>
          {info.map(e => (
            <Button key={`headerbutton_${e.text}`} {...e} />
          ))}
        </div>
      </nav>
    </header>
  );
}
