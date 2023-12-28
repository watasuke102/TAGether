// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import common from './Common.module.scss';
import filled from './Filled.module.scss';
import icon_and_text from './IconAndText.module.scss';
import material from './MaterialLike.module.scss';
import React from 'react';
import ButtonInfo from '@mytypes/ButtonInfo';

export default function Button(props: ButtonInfo): React.ReactElement {
  // cssの設定
  let css = filled;
  if (props.type === 'icon_desc') {
    css = icon_and_text;
  } else if (props.type === 'material') {
    css = material;
  }
  // アイコンと説明テキストのボタン
  const icon = props.icon === 'tagether' ? common.tagether : props.icon;
  return (
    <button className={css.button + ' ' + common.button} onClick={() => props.OnClick()}>
      <div className={css.button_icon}>
        <span className={icon} />
      </div>
      <span className={css.button_text}>{props.text}</span>
    </button>
  );
}