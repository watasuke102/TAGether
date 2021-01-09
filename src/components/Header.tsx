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
import ButtonInfo from '../types/ButtonInfo'

export default class Header extends React.Component {
  render() {
    let info: ButtonInfo[] = [];
    info.push({ type: "icon_desc", url: "/",        icon: "fas fa-home", text: "ホーム" });
    info.push({ type: "icon_desc", url: "/list",    icon: "fas fa-book", text: "問題リスト" });
    info.push({ type: "icon_desc", url: "/edit",    icon: "fas fa-pen",  text: "問題の編集/作成" });
    info.push({ type: "icon_desc", url: "/profile", icon: "fas fa-user", text: "プロフィール" });
    let button_list: object[] = [];
    info.forEach(element => {
      button_list.push(<Button info={element} />);
    })

    return (
      <header className={css.header}>
        <h1>Tagether</h1>
        <nav className={css.buttons}>
          {button_list}
        </nav>
      </header>
    )
  }
}