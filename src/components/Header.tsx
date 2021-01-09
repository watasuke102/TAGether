// TAGether - Share self-made exam for classmates
// Header.tsx
//
// CopyRight (c) 2020-2021 Watasuke
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
    info.push({ text: "ホーム",          icon: "fas fa-home", url: "/",        type: "icon_desc" });
    info.push({ text: "問題リスト",      icon: "fas fa-book", url: "/list",    type: "icon_desc" });
    info.push({ text: "問題の編集/作成", icon: "fas fa-pen",  url: "/edit",    type: "icon_desc" });
    info.push({ text: "プロフィール",    icon: "fas fa-user", url: "/profile", type: "icon_desc" });
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