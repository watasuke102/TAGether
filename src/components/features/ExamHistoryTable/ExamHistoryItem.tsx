// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './ExamHistoryItem.module.scss';
import React from 'react';
import Button from '@/common/Button/Button';
import Modal from '@/common/Modal/Modal';
import {AllCategoryDataType} from '@mytypes/Categoly';
import ExamHistory from '@mytypes/ExamHistory';
import Detail from '../CategolyCard/CategolyDetail';
import DeleteIcon from '@assets/delete.svg';
import CloseIcon from '@assets/close.svg';

interface Props {
  categoly: AllCategoryDataType;
  item: ExamHistory;
  remove: () => void;
}

export default function ExamHistoryItem(props: Props): React.ReactElement {
  const [is_modal_open, SetIsModalOpen] = React.useState(false);
  const [is_categoly_detail_open, SetIsCategolyDetailOpen] = React.useState(false);
  const rate = Math.round((props.item.correct_count / props.item.total_question) * 10000) / 100;

  return (
    <>
      <div className={css.container}>
        <div className={css.delete_button_wrapper}>
          <Button text='削除' icon={<DeleteIcon />} type='material' OnClick={() => SetIsModalOpen(true)} />
        </div>

        <span className={css.categoly_link} onClick={() => SetIsCategolyDetailOpen(true)}>
          {props.categoly.title}
        </span>

        <div className={css.status}>
          <span>
            {props.item.total_question}問中{props.item.correct_count}問正解 ({isNaN(rate) ? 0 : rate}%)
          </span>
          <span className={css.date}>{props.item.categoly.updated_at ?? ''}</span>
        </div>
      </div>

      <Modal isOpen={is_categoly_detail_open} close={() => SetIsCategolyDetailOpen(false)}>
        <Detail data={props.categoly} history={props.item} close={() => SetIsCategolyDetailOpen(false)} />
      </Modal>

      <Modal isOpen={is_modal_open} close={() => SetIsModalOpen(false)}>
        <div className={css.modal}>
          <span className={css.title}>{props.categoly.title}</span>
          <p>この解答履歴を削除しますか？</p>
          <div className={css.buttons}>
            <Button
              OnClick={() => {
                SetIsModalOpen(false);
              }}
              type='filled'
              icon={<CloseIcon />}
              text='閉じる'
            />
            <Button
              OnClick={() => {
                props.remove();
                SetIsModalOpen(false);
              }}
              type='filled'
              icon={<DeleteIcon />}
              text='削除する'
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
