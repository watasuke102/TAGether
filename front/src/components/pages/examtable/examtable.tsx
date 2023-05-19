// TAGether - Share self-made exam for classmates
// examtable.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
//
import css from './examtable.module.scss';
import Router from 'next/router';
import React from 'react';
import Helmet from 'react-helmet';
import BreakWithCR from '@/common/BreakWithCR/BreakWithCR';
import Button from '@/common/Button/Button';
import {SelectButton} from '@/common/SelectBox';
import {ParseAnswer} from '@/features/ParseAnswer';
import AnswerState from '@mytypes/AnswerState';
import Categoly from '@mytypes/Categoly';
import Exam from '@mytypes/Exam';
import ExamHistory from '@mytypes/ExamHistory';
import ExamStatus from '@mytypes/ExamState';

interface Props {
  data: Categoly;
  history?: ExamHistory;
}

export default function ExamTable(props: Props): React.ReactElement {
  const [show_correct_answer, SetShowCorrectAnswer] = React.useState(false);
  const [filter, SetFilter] = React.useState(0x07);

  const UpdateFilter = (type: AnswerState, state: boolean) => {
    SetFilter(filter => {
      if (state) {
        return filter | type;
      } else {
        return filter & (~type & 0x07);
      }
    });
  };

  const Result = (stat: ExamStatus) => {
    if (stat.total_question === 1) {
      if (stat.order === AnswerState.AllCorrect) return '正解';
      else return '不正解';
    }
    if (stat.order === AnswerState.AllCorrect) return '全問正解';
    if (stat.correct_count === 0) return '不正解';
    return `${stat.correct_count}問正解`;
  };

  const rate = props.history && Math.round((props.history.correct_count / props.history.total_question) * 10000) / 100;

  const result_list = (() => {
    let list = (JSON.parse(props.data.list) as Exam[]).map((exam, i) => (
      <tr key={`tr-${i}`}>
        <td>
          <BreakWithCR str={exam.question} />
        </td>
        {/* 表示した上で透明にすることで、表示・非表示を切り替えたときに高さが変わるのを防ぐ */}
        <td className={show_correct_answer ? '' : css.hide}>{ParseAnswer(exam.answer, exam)}</td>
        <td className={show_correct_answer ? '' : css.hide}>
          <BreakWithCR str={exam.comment ?? ''} />
        </td>
        {props.history && (
          <>
            <td>{ParseAnswer(props.history.exam_state[i].user_answer, exam)}</td>
            <td>{Result(props.history.exam_state[i])}</td>
          </>
        )}
      </tr>
    ));

    if (props.history) {
      list = list.filter((_, i) => (filter & props.history?.exam_state[i].order) !== 0);
    }
    return list;
  })();

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

      <table className={css.table}>
        <tbody>
          <tr>
            <th>問題</th>
            <th>正解</th>
            <th>コメント</th>
            {props.history && (
              <>
                <th>自分の解答</th>
                <th className={css.result}>結果</th>
              </>
            )}
          </tr>
          {result_list}
        </tbody>
      </table>

      <div className={css.button_container}>
        <div className={css.buttons}>
          <Button text='戻る' icon='fas fa-undo' OnClick={Router.back} type='material' />
          {/* 正しい答えの表示/非表示切り替え */}
          <Button
            OnClick={() => SetShowCorrectAnswer(!show_correct_answer)}
            type='material'
            text={show_correct_answer ? '正解を非表示' : '正解を表示'}
            icon={show_correct_answer ? 'fas fa-eye-slash' : 'fas fa-eye'}
          />
        </div>
      </div>
    </>
  );
}
