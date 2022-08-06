// TAGether - Share self-made exam for classmates
// examtable.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './examtable.module.scss';
import Router from 'next/router';
import React from 'react';
import Helmet from 'react-helmet';
import Button from '@/common/Button/Button';
import Loading from '@/common/Loading/Loading';
import {MultiSelectBox, SelectButton} from '@/common/SelectBox';
import ExamTableComponent from '@/features/ExamTable/ExamTableComponent';
import AnswerState from '@mytypes/AnswerState';
import Categoly from '@mytypes/Categoly';
import Exam from '@mytypes/Exam';
import ExamHistory from '@mytypes/ExamHistory';

interface Props {
  data: Categoly;
  history?: ExamHistory;
}

export default function ExamTable(props: Props): React.ReactElement {
  const [showCorrectAnswer, SetShowCorrectAnswer] = React.useState(false);
  const [filter, SetFilter] = React.useState(0x07);

  const rate = props.history && Math.round((props.history.correct_count / props.history.total_question) * 10000) / 100;
  const exam: Exam[] = (() => {
    let list: Exam[] = JSON.parse(props.data.list);
    if (props.history) {
      list = list.filter((_, i) => (filter & props.history?.user_answers[i].order) !== 0);
    }
    return list;
  })();

  const UpdateFilter = (type: AnswerState, state: boolean) => {
    SetFilter(filter => {
      if (state) {
        return filter | type;
      } else {
        return filter & (~type & 0x07);
      }
    });
  };

  return (
    <>
      <Helmet title={`問題一覧 : ${props.data.title} - TAGether`} />

      <div className={css.examdata_container}>
        <span className={css.title}>{props.data.title}</span>
        {props.history && (
          <>
            <div className={css.filter_selector}>
              <SelectButton
                type='multi'
                desc='全問正解'
                status={(filter & AnswerState.AllCorrect) !== 0}
                onChange={f => UpdateFilter(AnswerState.AllCorrect, f)}
              />
              <SelectButton
                type='multi'
                desc='部分正解'
                status={(filter & AnswerState.PartialCorrect) !== 0}
                onChange={f => UpdateFilter(AnswerState.PartialCorrect, f)}
              />
              <SelectButton
                type='multi'
                desc='不正解'
                status={(filter & AnswerState.AllWrong) !== 0}
                onChange={f => UpdateFilter(AnswerState.AllWrong, f)}
              />
            </div>
            <span>
              {props.history.total_question}問中{props.history.correct_count}問正解、 正答率{rate}%
            </span>
          </>
        )}
      </div>

      <div className={css.table}>
        <ExamTableComponent exam={exam} showCorrectAnswer={showCorrectAnswer} />
      </div>

      <div className={css.button_container}>
        <div className={css.buttons}>
          <Button text='戻る' icon='fas fa-undo' onClick={Router.back} type='material' />
          {/* 正しい答えの表示/非表示切り替え */}
          <Button
            onClick={() => SetShowCorrectAnswer(!showCorrectAnswer)}
            type='material'
            text={showCorrectAnswer ? '正解を非表示' : '正解を表示'}
            icon={showCorrectAnswer ? 'fas fa-eye-slash' : 'fas fa-eye'}
          />
        </div>
      </div>
    </>
  );
}
