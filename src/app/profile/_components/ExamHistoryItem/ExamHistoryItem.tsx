// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './ExamHistoryItem.module.scss';
import React from 'react';
import Button from '@/common/Button/Button';
import Modal from '@/common/Modal/Modal';
import {delete_history} from '@utils/api/history';
import {AllHistory} from '@mytypes/ExamHistory';
import DeleteIcon from '@assets/delete.svg';
import CloseIcon from '@assets/close.svg';
import ClockIcon from '@assets/clock.svg';
import {useRouter} from 'next/navigation';
import {history_title} from '@utils/HistoryTitle';

export function ExamHistoryItem(props: AllHistory): React.ReactElement {
  const [is_modal_open, SetIsModalOpen] = React.useState(false);
  const [correct_answers, total_questions] = props.exam_state.reduce(
    (acc, cur) => [acc[0] + cur.correct_count, acc[1] + cur.total_question],
    [0, 0],
  );
  const rate = Math.round((correct_answers / total_questions) * 10000) / 100;
  const router = useRouter();

  return (
    <>
      <div className={css.container}>
        <div className={css.delete_button}>
          <Button text='削除' icon={<DeleteIcon />} type='material' OnClick={() => SetIsModalOpen(true)} />
        </div>

        <span className={css.title} onClick={() => router.push(`/examtable?history_id=${props.id}`)}>
          {history_title(props)}
        </span>

        <div className={css.status}>
          <span>
            {total_questions}問中{correct_answers}問正解 ({isNaN(rate) ? 0 : rate}%)
          </span>
          <span className={css.date}>{props.created_at.slice(0, -5).replace('T', ' ')}</span>
        </div>
        <div className={css.redo_button}>
          {total_questions !== correct_answers && (
            <Button
              text='解き直し'
              icon={<ClockIcon />}
              type='material'
              OnClick={() => router.push(`/exam?history_id=${props.id}`)}
            />
          )}
        </div>
      </div>

      <Modal isOpen={is_modal_open} close={() => SetIsModalOpen(false)}>
        <div className={css.modal}>
          <span className={css.title}>{history_title(props)}</span>
          <p>この解答履歴を削除しますか？</p>
          <div className={css.buttons}>
            <Button
              OnClick={() => {
                SetIsModalOpen(false);
              }}
              type='material'
              icon={<CloseIcon />}
              text='閉じる'
            />
            <Button
              OnClick={() => {
                delete_history(props.id).then(() => SetIsModalOpen(false));
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
