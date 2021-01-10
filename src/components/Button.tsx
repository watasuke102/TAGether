// TAGether - Share self-made exam for classmates
// Button.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import filled from '../style/Button/Filled.module.css'
import material from '../style/Button/MaterialLike.module.css'
import icon_and_text from '../style/Button/IconAndText.module.css'
import React from 'react';
import ButtonInfo from '../types/ButtonInfo'

function GetStyleFromButtonType(type: string) {
}

export default function Button(props) {
  const info: ButtonInfo = props.info;
  // cssの設定
  let css = filled;
  if (info.type == 'icon_desc') {
    css = icon_and_text;
  } else if (info.type == 'material') {
    css = material;
  }
  // アイコンと説明テキストのボタン
    return (
      <div
        className={css.button}
        onClick={() => info.onClick()}
      >
        <div className={css.button_icon}>
          <span className={info.icon}></span>
        </div>
        <span className={css.button_text}>{info.text}</span>
      </div>
    );
}