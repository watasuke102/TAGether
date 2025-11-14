// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import common from './Common.module.scss';
import filled from './Filled.module.scss';
import material from './MaterialLike.module.scss';
import React from 'react';
import ButtonInfo from '@mytypes/ButtonInfo';

export default function Button(props: ButtonInfo): React.ReactElement {
  const css = props.variant === 'material' ? material : filled;
  return (
    <button
      className={css.button + ' ' + common.button}
      type={props.type ?? 'button'}
      onClick={() => props.OnClick?.()}
    >
      <div className={css.button_icon}>{props.icon}</div>
      {props.text !== '' && <span className={css.button_text}>{props.text}</span>}
    </button>
  );
}
