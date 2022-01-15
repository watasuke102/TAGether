// TAGether - Share self-made exam for classmates
// ExamHistoryItem.tsx
//
// CopyRight (c) 2020-2021 Watasuke
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
  const rate = Math.round((props.item.correct_count / props.item.total_question) * 10000) / 100;

  function PushExamPage() {
    const history_id = props.item.history_key ?? -1;
    const shuffle = props.isShuffleEnabled;
    Router.push(`/exam?history_id=${history_id}&shuffle=${shuffle}`);
  }

  return (
    <>
      <div className={css.container}>
        <Button text='削除' icon='fas fa-trash-alt' type='material' onClick={props.remove} />

        <div className={css.link_container}>
          <span className={css.categoly_link} onClick={() => setIsModalOpen(true)}>
            {props.categoly.title}
          </span>
        </div>

        <div className={css.status}>
          <span>
            {props.item.total_question}問中{props.item.correct_count}問正解 ({isNaN(rate) ? 0 : rate}%)
          </span>
          <span className={css.date}>{props.item.date}</span>
        </div>

        {props.item.wrong_exam &&
          (props.item.wrong_exam.length === 0 ? (
            <p>全問正解しています</p>
          ) : (
            <Button text='解き直し' icon='fas fa-edit' type='material' onClick={PushExamPage} />
          ))}
      </div>

      <Modal isOpen={isModalOpen} close={() => setIsModalOpen(false)}>
        <Detail {...{data: props.categoly, close: () => setIsModalOpen(false)}} />
      </Modal>
    </>
  );
}
