// TAGether - Share self-made exam for classmates
// Card.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Modal.module.css';
import React from 'react';
import ModalData from '../types/ModalData';

export default function ExamCard(props: ModalData) {
  //開かれていない場合は空要素を渡す
  if (!props.isOpen) {
    return (<></>);
  }
  return (
    <div className={css.background}>
      <div className={css.detail}>
        {props.body}
      </div>
    </div>
  );
}