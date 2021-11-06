// TAGether - Share self-made exam for classmates
// CheckBox.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/components/CheckBox.module.scss';
import React from 'react';

interface Props {
  status: boolean,
  desc: string,
  onChange: (boolean) => void,
}

export default function CheckBox(props: Props): React.ReactElement {
  return (
    <div className={css.container} onClick={() => props.onChange(!props.status)}>
      <div className={`${css.box} ${props.status ? css.box_checked : css.box_not_checked}`} >
        <span className='fas fa-check' />
      </div>
      <span>{props.desc}</span>
    </div>
  );
}
