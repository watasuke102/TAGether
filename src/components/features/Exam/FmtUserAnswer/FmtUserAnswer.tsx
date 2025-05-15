// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './FmtUserAnswer.module.scss';
import React from 'react';
import Exam from '@mytypes/Exam';

type Props = {
  exam: Exam;
  user_answer: string[];
  result: boolean[];
};

export function FmtUserAnswer(props: Props): JSX.Element {
  return (
    <>
      {(() => {
        switch (props.exam.type ?? 'Text') {
          case 'Text':
            if (props.exam.answer.length === 1) {
              return <span className={(props.result?.at(0) ?? true) ? '' : css.wrong}>{props.user_answer[0]}</span>;
            }
            return (
              <ol>
                {props.user_answer.map((e, i) => (
                  <li key={'result_select_' + i} className={(props.result?.at(i) ?? true) ? '' : css.wrong}>
                    {e}
                  </li>
                ))}
              </ol>
            );
          case 'Select':
            return (
              <span className={(props.result?.at(0) ?? true) ? '' : css.wrong}>
                {props.exam.question_choices?.at(Number(props.exam.answer[0]))}
              </span>
            );
          case 'MultiSelect':
            return (
              <ul>
                {props.exam.answer
                  .filter((_m, i) => props.user_answer[i] === String(i))
                  .map((e, i) => (
                    <li key={'result_multiselect_' + i} className={(props.result?.at(i) ?? true) ? '' : css.wrong}>
                      {e}
                    </li>
                  ))}
              </ul>
            );
          case 'Sort':
            return (
              <ol>
                {props.user_answer.map((e, i) => (
                  <li key={'result_sort_' + i} className={(props.result?.at(i) ?? true) ? '' : css.wrong}>
                    {e}
                  </li>
                ))}
              </ol>
            );
          case 'ListSelect':
            return (
              <ol>
                {props.user_answer.map((e, i) => (
                  <li key={'result_listselect_' + i} className={(props.result?.at(i) ?? true) ? '' : css.wrong}>
                    {e}
                  </li>
                ))}
              </ol>
            );

          default:
            throw Error('invalid Exam type');
        }
      })()}
    </>
  );
}
