// TAGether - Share self-made exam for classmates
// ExamTableComponent.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './ExamTableComponent.module.scss';
import React from 'react';
import {ParseAnswer} from '@/features/ParseAnswer';
import AnswerState from '@mytypes/AnswerState';
import Exam from '@mytypes/Exam';
import ExamState from '@mytypes/ExamState';

interface Props {
  showCorrectAnswer: boolean;
  exam: Exam[];
  examState?: ExamState[];
  answers?: string[][];
}

export default function ExamTable(props: Props): React.ReactElement {
  // 連番配列を作成
  let index: number[] = [];
  for (let i = 0; i < props.exam.length; i++) index.push(i);
  // examStateのorder順にソート
  if (props.examState) {
    const first: number[] = [];
    const second: number[] = [];
    const third: number[] = index;

    props.examState.forEach((e, i) => {
      switch (e.order) {
        case AnswerState.AllWrong:
          first.push(third[i]);
          third[i] = -1;
          break;
        case AnswerState.PartialCorrect:
          second.push(third[i]);
          third[i] = -1;
          break;
        case AnswerState.AllCorrect:
          break;
      }
    });
    // 連結する
    // 条件に合うorderがなかった場合、配列がundefinedになるため、それをfilterで削除
    index = first.concat(second.concat(third)).filter(e => e !== undefined && e !== -1);
  }

  function Status(i: number): React.ReactElement | undefined {
    if (!props.examState || !props.answers) return;
    // 正解or不正解、もしくはn問正解の表示
    const count = props.examState[i].correctAnswerCount;
    const len = props.exam[i].answer.length;
    let correct_state: string = '';
    if (len === 1) {
      correct_state = count === 1 ? '正解' : '不正解';
    } else {
      correct_state = `${count === len ? '全' : count}問正解`;
    }
    return (
      <>
        {/* 自分の解答 */}
        <td>{ParseAnswer(props.answers[i], props.exam[i])}</td>
        <td>
          <span key={`state_${i} `}>{correct_state}</span>
        </td>
      </>
    );
  }
  const list: React.ReactElement[] = [];
  const exam = props.exam;
  index.forEach(i => {
    list.push(
      <tr key={`item_${i} `}>
        <td>
          {
            // 問題
            exam[i].question.split('\n').map(str => {
              return (
                <span key={`q_${i} `}>
                  {str}
                  <br />
                </span>
              );
            })
          }
        </td>
        <td className={props.showCorrectAnswer ? '' : css.hide_correct_answer}>
          {ParseAnswer(exam[i].answer, props.exam[i])}
        </td>
        {/* 自分の解答+何問正解したか */ Status(i)}
      </tr>,
    );
  });
  let state_th: React.ReactElement = <></>;
  if (props.examState && props.answers)
    state_th = (
      <>
        <th>自分の解答</th>
        <th>状態</th>
      </>
    );
  return (
    <>
      <div className={css.table}>
        <table>
          <tbody>
            <tr>
              <th>問題</th>
              <th>正解</th>
              {state_th}
            </tr>
            {list}
          </tbody>
        </table>
      </div>

      <div className={css.bottom} />
    </>
  );
}
