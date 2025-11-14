// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './CategoryCard.module.scss';
import React from 'react';
import {Card} from '@/common/Card';
import Modal from '@/common/Modal/Modal';
import {AllCategoryDataType} from '@mytypes/Category';
import Detail from './CategoryDetail';
import FavoriteStar from './FavoriteStar';
import Tag from '../TagContainer/TagContainer';

export default function ExamCard(props: AllCategoryDataType): React.ReactElement {
  const [is_modal_open, SetIsModalOpen] = React.useState(false);

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
        <Card onClick={() => SetIsModalOpen(true)}>
          <div className={css.card}>
            <p className={css.title}>{title}</p>
            <p className={css.desc}> {desc} </p>
            <Tag tag={props.tag} />
            <FavoriteStar id={props.id ?? -1} />
          </div>
        </Card>
      </div>

      <Modal isOpen={is_modal_open} close={() => SetIsModalOpen(false)}>
        <Detail {...{data: props, close: () => SetIsModalOpen(false)}} />
      </Modal>
    </>
  );
}
