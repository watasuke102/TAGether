// TAGether - Share self-made exam for classmates
// Toast.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Toast.module.css';
import React from 'react';

interface Props {
  children: React.ReactNode,
  isOpen: boolean,
  stateChange: Function
}

export default function Toast(props: Props) {
  if (!props.isOpen)
    return <></>
  return (
    <div id={css.container}>
      {props.children}
    </div>
  );
}