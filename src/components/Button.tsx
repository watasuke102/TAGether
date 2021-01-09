// TAGether - Share self-made exam for classmates
// Button.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Button.module.css'
import material_css from '../style/MaterialLikeButton.module.css'
import React from 'react';
import Router from 'next/router'
import ButtonInfo from '../types/ButtonInfo'

function GetStyleFromButtonType(type: string) {
  if (type == 'icon_desc') {
    return css.icon_desc;
  }
  return css.material_like;
}

export default class Button extends React.Component<any> {
  render() {
    const info: ButtonInfo = this.props.info;
    if (info.type == 'icon_desc') {
      return (
        <div
          className={css.button}
          onClick={() => Router.push(info.url)}
        >
          <div className={css.button_icon}>
            <span className={info.icon}></span>
          </div>
          <span className={css.button_text}>{info.text}</span>
        </div>
      );
    } else {
      return (
        <div
          className={material_css.button}
          onClick={() => Router.push(info.url)}
        >
        <div className={material_css.button_icon}>
          <span className={info.icon}></span>
        </div>
        <span className={material_css.button_text}>{info.text}</span>
        </div>
      );
    }
  }
}