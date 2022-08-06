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
  const [showCorrectAnswer, SetShowCorrectAnswer] = React.useState(false);
  const [filter, SetFilter] = React.useState(0x07);

  const rate = props.history && Math.round((props.history.correct_count / props.history.total_question) * 10000) / 100;
  const exam_list: Exam[] = (() => {
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

  const Result = (stat: ExamStatus) => {
    if (stat.userAnswer.length === 1) {
      if (stat.order === AnswerState.AllCorrect) return '正解';
      else return '不正解';
    }
    if (stat.order === AnswerState.AllCorrect) return '全問正解';
    return `${stat.correctAnswerCount}問正解`;
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
          {exam_list.map((exam, i) => (
            <tr key={`tr-${i}`}>
              <td>
                <BreakWithCR str={exam.question} />
              </td>
              {/* 表示した上で透明にすることで、表示・非表示を切り替えたときに高さが変わるのを防ぐ */}
              <td className={showCorrectAnswer ? '' : css.hide}>{ParseAnswer(exam.answer, exam)}</td>
              <td className={showCorrectAnswer ? '' : css.hide}>
                <BreakWithCR str={exam.comment ?? ''} />
              </td>
              {props.history && (
                <>
                  <td>{ParseAnswer(props.history.user_answers[i].userAnswer, exam)}</td>
                  <td>{Result(props.history.user_answers[i])}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

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
