// TAGether - Share self-made exam for classmates
// Header.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Header.module.scss';
import React from 'react';
import Router from 'next/router';
import Button from './Button';
import ButtonInfo from '../types/ButtonInfo';

interface State { isFixedButtons: boolean }

// TODO: どうにかならないかなぁ
/* eslint @typescript-eslint/no-explicit-any: 0 */
export default class Header extends React.Component<any, State> {
  constructor(props: State) {
    super(props);
    this.state = { isFixedButtons: false };
  }

  componentDidMount(): void {
    window.addEventListener('scroll', () => this.SetIsFixedButtons(), true);
  }
  componentWillUnmount(): void {
    window.removeEventListener('scroll', () => this.SetIsFixedButtons(), true);
  }

  SetIsFixedButtons(): void {
    if (!process.browser) return;
    let isFixedButtons = false;
    if (window.pageYOffset > 90) {
      isFixedButtons = true;
    }
    this.setState({ isFixedButtons: isFixedButtons });
  }

  ButtonContainersCSS(): string {
    if (!this.state.isFixedButtons) return css.buttons_container;
    return css.buttons_container_fixed;
  }

  render(): React.ReactElement {
    const info: ButtonInfo[] = [];
    info.push({ text: 'ホーム', icon: 'fas fa-home', onClick: () => Router.push('/'), type: 'icon_desc' });
    info.push({ text: 'カテゴリ一覧', icon: 'fas fa-book', onClick: () => Router.push('/list'), type: 'icon_desc' });
    info.push({ text: 'プロフィール', icon: 'fas fa-user', onClick: () => Router.push('/profile'), type: 'icon_desc' });
    const button_list: React.ReactElement[] = [];
    info.forEach(element => {
      button_list.push(<Button key={`headerbutton_${element.text}`} {...element} />);
    });

    return (
      <header className={css.header}>
        <h1>TAGether</h1>
        <nav className={this.ButtonContainersCSS()}>
          <div className={css.buttons}>
            {button_list}
          </div>
        </nav>
      </header>
    );
  }
}