// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './FinishModal.module.scss';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ExamReducerContext } from '../ExamReducer';
import Modal from '@/common/Modal/Modal';
import TadaIcon from '@assets/tada.svg';
import ButtonContainer from '@/common/Button/ButtonContainer';
import Button from '@/common/Button/Button';
import EditIcon from '@assets/edit.svg';
import ListIcon from '@assets/list.svg';
import ArrowLeftIcon from '@assets/arrow-left.svg';

type Props = {
  inserted_history_id: string;
};

export function FinishModal(props: Props): JSX.Element {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id');

  const [state, dispatch] = React.useContext(ExamReducerContext);
  const [correct_answers, total_questions] = state.exam_state.reduce(
    (acc, cur) => [acc[0] + cur.correct_count, acc[1] + cur.total_question],
    [0, 0],
  );
  const correct_rate = Math.round((correct_answers / total_questions) * 10000) / 100;

  return (
    <Modal isOpen={state.is_modal_open} close={() => dispatch({ type: 'is_modal_open/set', data: false })}>
      <div className={css.modal}>
        <div className={css.modal_header}>
          <TadaIcon /> <span>問題終了</span>
        </div>
        <div
          className={css.correct_rate}
          role='text'
          aria-label={`正答率${correct_rate}%、${total_questions}問中${correct_answers}問正解`}
        >
          <div aria-hidden>
            正答率
            <span className={css.percentage}>{correct_rate}</span>%
          </div>
          <div aria-hidden className={css.question_num_wrapper}>
            <span className={css.question_num}>{total_questions}</span>
            問中
            <span className={css.question_num}>{correct_answers}</span>
            問正解
          </div>
        </div>
        <ButtonContainer>
          <Button
            text={'編集する'}
            icon={<EditIcon />}
            variant={'material'}
            OnClick={() => id && router.push(`/edit?id=${id}`)}
          />
          <Button
            text={'結果一覧'}
            icon={<ListIcon />}
            variant={'material'}
            OnClick={() => router.push(`/examtable?history_id=${props.inserted_history_id}`)}
          />
          <Button
            text={'カテゴリ一覧へ移動'}
            icon={<ArrowLeftIcon />}
            variant={'filled'}
            OnClick={() => router.push('/list')}
          />
        </ButtonContainer>
      </div>
    </Modal>
  );
}
