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

export default function ExamCard(props: Categoly) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  // Modalに渡す用のデータ
  const modalData: ModalData = {
    body: <Detail {...{ data: props, close: () => setIsModalOpen(false) }} />,
    isOpen: isModalOpen,
    close: () => setIsModalOpen(false),
  };

  // タイトルを25文字以内に
  let title = props.title;
  if (props.title.length > 25) {
    title = props.title.slice(0, 25) + '...';
  }
  // 説明を100文字以内に
  let desc = props.desc;
  if (props.desc.length > 100) {
    desc = props.desc.slice(0, 100) + '...';
  }

  return (
    <>
      <div className={css.card} onClick={() => { setIsModalOpen(true) }}>
        <p className={css.title}>{title}</p>
        <p className={css.desc}> {desc} </p>
        <Tag tag={props.tag} />
      </div>

      <Modal {...modalData} />
    </>
  );
}