// TAGether - Share self-made exam for classmates
// ExamHistoryTableItem.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//

import css from '../styles/ExamHistoryTableItem.module.scss';
import React from 'react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Detail from '../components/CategolyDetail';
import Categoly from '../types/Categoly';
import ModalData from '../types/ModalData';
import ExamHistory from '../types/ExamHistory';
import { useHistory } from 'react-router-dom';

interface Props {
  categoly: Categoly,
  item: ExamHistory
}

export default function ExamHistoryTableItem(props: Props): React.ReactElement {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const Router = useHistory();
  // Modalに渡す用のデータ
  const modalData: ModalData = {
    body: <Detail {...{ data: props.categoly, close: () => setIsModalOpen(false) }} />,
    isOpen: isModalOpen,
    close: () => setIsModalOpen(false),
  };
  const rate = Math.round((props.item.correct_count / props.item.total_question) * 10000) / 100;



  return (
    <tr>
      <td>{props.item.date}</td>

      <td>
        <p className={css.categoly_link} onClick={() => setIsModalOpen(true)}>
          {props.categoly.title}
        </p>
      </td>

      <td>{props.item.total_question}問中{props.item.correct_count}問正解</td>

      <td>{isNaN(rate) ? 0 : rate}%</td>

      <td>
        <div className={css.button}>
          {(props.item.wrong_exam.length === 0) ?
            <p>全問正解しています</p>
            :
            <Button {...{
              text: '解き直し', icon: 'fas fa-edit', type: 'material',
              onClick: () => Router.push(`/exam?history_id=${props.item.history_key ?? null}`)
            }} />
          }
        </div>
      </td>

      <Modal {...modalData} />
    </tr>
  );
}
