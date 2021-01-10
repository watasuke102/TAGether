// TAGether - Share self-made exam for classmates
// Card.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Card.module.css';
import React from 'react';
import Tag from './Tag';
import Modal from './Modal';
import Detail from './CategolyDetail';
import Categoly from '../types/Categoly';
import ModalData from '../types/ModalData';

export default function ExamCard(props) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const data: Categoly = props.data;
  // Modalに渡す用のデータ
  const modalData: ModalData = {
    body: <Detail data={data} close={() => setIsModalOpen(false)} />,
    isOpen: isModalOpen,
  };

  return (
    <>
      <div className={css.card} onClick={() => { setIsModalOpen(true) }}>
        <p className={css.title}>{data.title}</p>
        <p className={css.desc}> {data.desc} </p>
        <Tag tag={data.tag} />
      </div>

      <Modal data={modalData} />
    </>
  );
}