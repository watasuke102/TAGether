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
import Detail from './CategolyDetail';
import ModalData from '../types/ModalData';

export default function ExamCard(props) {
  const data: ModalData = props.data;
  //開かれていない場合は空要素を渡す
  if (!data.isOpen) {
    return (<></>);
  }
  console.log()
  return (
    <div className={css.background}>
      <div className={css.detail}>
        <Detail data={data.data} close={() => data.close()} />
      </div>
    </div>
  );
}