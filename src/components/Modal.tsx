// TAGether - Share self-made exam for classmates
// Modal.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Modal.module.css';
import React from 'react';
import ModalData from '../types/ModalData';

export default function Modal(props: ModalData) {
  document.documentElement.style.setProperty('--vh', (window.innerHeight / 100) + 'px');
  //開かれていない場合は空要素を渡す
  if (!props.isOpen) {
    return (<></>);
  }
  return (
      <div className={css.background} onClick={() => props.close()}>
        <div className={css.window} onClick={(e) => e.stopPropagation()}>
          {props.body}
        </div>
    </div>
  );
}