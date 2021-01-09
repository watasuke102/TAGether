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

function GetStyleFromButtonType(type: string) {
  if (type == 'icon_desc') {
    return css.icon_desc;
  }
  return css.material_like;
}

export default class Button extends React.Component<any> {
  render() {
    return (
      <div
        className={GetStyleFromButtonType(this.props.info.type)}
        onClick={() => Router.push(this.props.info.url)}
      >
        <div className={css.button_icon}>
          <span className={this.props.info.icon}></span>
        </div>
        <span className={css.button_text}>{this.props.info.text}</span>
      </div>
    )
  }
}