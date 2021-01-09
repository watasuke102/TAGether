// TAGether - Share self-made exam for classmates
// Button.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Button/IconAndText.module.css'
import material_css from '../style/Button/MaterialLike.module.css'
import React from 'react';
import ButtonInfo from '../types/ButtonInfo'

function GetStyleFromButtonType(type: string) {
  if (type == 'icon_desc') {
    return css.icon_desc;
  }
  return css.material_like;
}

export default function Button(props) {
  const info: ButtonInfo = props.info;
  // アイコンと説明テキストのボタン
  if (info.type == 'icon_desc') {
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
  } else {
    // マテリアルっぽいボタン
    return (
      <div
        className={material_css.button}
        onClick={() => info.onClick()}
      >
      <div className={material_css.button_icon}>
        <span className={info.icon}></span>
      </div>
      <span className={material_css.button_text}>{info.text}</span>
      </div>
    );
  }
}