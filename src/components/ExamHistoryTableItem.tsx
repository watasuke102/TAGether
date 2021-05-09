import React from 'react';
import Modal from '../components/Modal';
import Detail from '../components/CategolyDetail';
import Categoly from '../types/Categoly';
import ModalData from '../types/ModalData';
import ExamHistory from '../types/ExamHistory';

interface Props {
  categoly: Categoly,
  item: ExamHistory
}

export default function ExamHistoryTableItem(props: Props) {
  console.log(props);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
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
      <a onClick={() => { console.log('categoly is', props.categoly); setIsModalOpen(true) }}>
        {props.categoly.title}
      </a>
      <td>{props.item.total_question}問中{props.item.correct_count}問正解</td>
      <td>{isNaN(rate) ? 0 : rate}%</td>
      <Modal {...modalData} />
    </tr>
  );
}
