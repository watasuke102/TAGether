// TAGether - Share self-made exam for classmates
// Button.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import filled from '../style/components/Button/Filled.module.scss';
import material from '../style/components/Button/MaterialLike.module.scss';
import icon_and_text from '../style/components/Button/IconAndText.module.scss';
import common from '../style/components/Button/Common.module.scss';
import React from 'react';
import ButtonInfo from '../types/ButtonInfo';

export default function Button(props: ButtonInfo): React.ReactElement {
  // cssの設定
  let css = filled;
  if (props.type == 'icon_desc') {
    css = icon_and_text;
  } else if (props.type == 'material') {
    css = material;
  }
  // アイコンと説明テキストのボタン
  return (
    <button
      className={css.button + ' ' + common.button}
      onClick={() => props.onClick()}
    >
      <div className={css.button_icon}>
        <span className={props.icon}></span>
      </div>
      <span className={css.button_text}>{props.text}</span>
    </button>
  );
}