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
    info.push({ url: "/",        icon: "fas fa-home", desc: "ホーム" });
    info.push({ url: "/list",    icon: "fas fa-book", desc: "問題リスト" });
    info.push({ url: "/edit",    icon: "fas fa-pen",  desc: "問題の編集/作成" });
    info.push({ url: "/profile", icon: "fas fa-user", desc: "プロフィール" });
    console.log(info);
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