// TAGether - Share self-made exam for classmates
// Card.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Card.module.scss';
import React from 'react';
import Tag from './Tag';
import Modal from './Modal';
import Detail from './CategolyDetail';
import { UpdateFavorite, GetFavorite } from '../ts/ManageDB';
import Categoly from '../types/Categoly';
import ModalData from '../types/ModalData';

export default function ExamCard(props: Categoly) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [favorite_status, SetFavoriteStatus] = React.useState(false);
  React.useEffect(() => {
    GetFavorite().then(res => SetFavoriteStatus(res.includes(props.id ?? -1)));
  }, [])
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
      <div className={css.container}>
        <div className={css.card} onClick={() => { setIsModalOpen(true) }}>
          <p className={css.title}>{title}</p>

          <div className={css.bottom_items}>
            <p className={css.desc}> {desc} </p>
            <Tag tag={props.tag} />
            <div
              className={css.favorite_button}
              style={{ color: favorite_status ? '#c2eb2f' : '#eee' }}
              onClick={(e) => {
                e.stopPropagation();
                UpdateFavorite(props.id ?? -1);
                SetFavoriteStatus(!favorite_status);
              }}
            >
              <span className='fas fa-star' />
            </div>
          </div>

        </div>
      </div>

      <Modal {...modalData} />
    </>
  );
}