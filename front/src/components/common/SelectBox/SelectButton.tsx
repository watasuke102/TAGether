// TAGether - Share self-made exam for classmates
// CheckBox.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
//
import css from './SelectButton.module.scss';
import React from 'react';

interface Props {
  type: 'multi' | 'single';
  status: boolean;
  desc: string;
  id?: string;
  tabIndex?: number;
  onChange: (boolean) => void;
}

export default function SelectButton(props: Props): React.ReactElement {
  const style = props.type === 'multi' ? css.multi : css.single;

  return (
    <div
      className={css.container}
      id={props.id}
      tabIndex={props.tabIndex ?? 0}
      onClick={() => props.onChange(!props.status)}
      onKeyDown={e => {
        // FocusしてEnterしたときに状態変化
        if (e.code === 'Space' || e.code === 'Enter') props.onChange(!props.status);
      }}
    >
      <div className={`${css.box} ${style}`}>
        {
          // statusがtrueなら表示
          // multiだったらチェックマーク、singleだったらラジオボタンのような円形
          !props.status ? (
            <></>
          ) : props.type === 'multi' ? (
            <span className={`fas fa-check ${css.multi_checked}`} />
          ) : (
            <div className={css.single_checked} />
          )
        }
      </div>
      <span>{props.desc}</span>
    </div>
  );
}
