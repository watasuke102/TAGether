// TAGether - Share self-made exam for classmates
// Header.tsx
//
// CopyRight (c) 2020 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Header.module.css'
import React from 'react';
import Button from './Button';

export default class Header extends React.Component {
  render() {
    return (
      <header className={css.header}>
        <h1>Tagether</h1>
        <nav className={css.buttons}>
          <Button url="/"        icon="fas fa-home" desc="ホーム" />
          <Button url="/list"    icon="fas fa-book" desc="問題リスト" />
          <Button url="/edit"    icon="fas fa-pen"  desc="問題の編集/作成" />
          <Button url="/profile" icon="fas fa-user" desc="プロフィール" />
        </nav>
      </header>
    )
  }
}