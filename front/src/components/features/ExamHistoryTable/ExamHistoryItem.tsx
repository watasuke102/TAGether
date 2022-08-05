// TAGether - Share self-made exam for classmates
// ExamHistoryItem.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './ExamHistoryItem.module.scss';
import Router from 'next/router';
import React from 'react';
import Button from '@/common/Button/Button';
import Modal from '@/common/Modal/Modal';
import Categoly from '@mytypes/Categoly';
import ExamHistory from '@mytypes/ExamHistory';
import Detail from '../CategolyCard/CategolyDetail';

interface Props {
  categoly: Categoly;
  item: ExamHistory;
  isShuffleEnabled: boolean;
  remove: () => void;
}

export default function ExamHistoryItem(props: Props): React.ReactElement {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isCategolyDetailOpen, setIsCategolyDetailOpen] = React.useState(false);
  const rate = Math.round((props.item.correct_count / props.item.total_question) * 10000) / 100;

  function PushExamPage() {
    const history_id = props.item.history_key ?? -1;
    const shuffle = props.isShuffleEnabled;
    Router.push(`/exam?history_id=${history_id}&shuffle=${shuffle}`);
  }

  return (
    <>
      <div className={css.container}>
        <Button text='削除' icon='fas fa-trash-alt' type='material' onClick={() => setIsModalOpen(true)} />

        <span className={css.categoly_link} onClick={() => setIsCategolyDetailOpen(true)}>
          {props.categoly.title}
        </span>

        <div className={css.status}>
          <span>
            {props.item.total_question}問中{props.item.correct_count}問正解 ({isNaN(rate) ? 0 : rate}%)
          </span>
          <span className={css.date}>{props.item.categoly.updated_at ?? ''}</span>
        </div>

        {props.item.correct_count === props.item.total_question ? (
          <span className={css.all_correct}>全問正解</span>
        ) : (
          <Button text='解き直し' icon='fas fa-edit' type='material' onClick={PushExamPage} />
        )}
      </div>

      <Modal isOpen={isCategolyDetailOpen} close={() => setIsCategolyDetailOpen(false)}>
        <Detail data={props.categoly} close={() => setIsCategolyDetailOpen(false)} />
      </Modal>

      <Modal isOpen={isModalOpen} close={() => setIsModalOpen(false)}>
        <div className={css.modal}>
          <span className={css.title}>{props.categoly.title}</span>
          <p>この解答履歴を削除しますか？</p>
          <div className={css.buttons}>
            <Button
              onClick={() => {
                setIsModalOpen(false);
              }}
              type='filled'
              icon='fas fa-times'
              text='閉じる'
            />
            <Button
              onClick={() => {
                props.remove();
                setIsModalOpen(false);
              }}
              type='filled'
              icon='fas fa-trash-alt'
              text='削除する'
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
