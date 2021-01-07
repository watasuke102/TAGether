// TAGether - Share self-made exam for classmates
// Button.tsx
//
// CopyRight (c) 2020 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Button.module.css'
import React from 'react';
import Router from 'next/router'
import { UrlObject } from 'url';

interface ButtonInfo {
  url:  UrlObject,
  icon: string,
  desc: string
}

export default class Button extends React.Component<ButtonInfo> {
  render() {
    return (
      <div className={css.button} onClick={() => Router.push(this.props.url)}>
        <div className={css.button_icon}>
          <span className={this.props.icon}></span>
        </div>
        <span className={css.button_desc}>{this.props.desc}</span>
      </div>
    )
  }
}