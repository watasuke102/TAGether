// TAGether - Share self-made exam for classmates
// Card.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './Card.module.scss';
import React from 'react';
import Modal from '@/common/Modal/Modal';
import Categoly from '@mytypes/Categoly';
import Tag from '../TagContainer/TagContainer';
import Detail from './CategolyDetail';
import FavoriteStar from './FavoriteStar';

export default function ExamCard(props: Categoly): React.ReactElement {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // タイトルを25文字以内に
  let title = props.title;
  if (props.title.length > 25) {
    title = props.title.slice(0, 25) + '...';
  }
  // 説明を100文字以内に
  let desc = props.description;
  if (desc.length > 100) {
    desc = desc.slice(0, 100) + '...';
  }

  return (
    <>
      <div className={css.container}>
        <div className={css.card} onClick={() => setIsModalOpen(true)}>
          <p className={css.title}>{title}</p>

          <div className={css.bottom_items}>
            <p className={css.desc}> {desc} </p>
            <Tag tag={props.tag} />
          </div>
          <FavoriteStar id={props.id ?? -1} />
        </div>
      </div>

      <Modal isOpen={isModalOpen} close={() => setIsModalOpen(false)}>
        <Detail {...{data: props, close: () => setIsModalOpen(false)}} />
      </Modal>
    </>
  );
}
