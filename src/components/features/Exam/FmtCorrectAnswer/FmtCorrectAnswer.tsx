// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './FmtCorrectAnswer.module.scss';
import React from 'react';
import Exam from '@mytypes/Exam';
type Props = {
  result?: boolean[];
  exam: Exam;
};

export function FmtCorrectAnswer(props: Props): JSX.Element {
  function split_text(text: string): JSX.Element[] {
    const array: JSX.Element[] = [];
    text.split('&').forEach((e, i) => {
      array.push(
        <span className={css.answer_text} key={text + i}>
          {e}
        </span>,
      );
      array.push(<> or </>);
    });
    array.splice(-1);
    return array;
  }
  return (
    <>
      {(() => {
        switch (props.exam.type ?? 'Text') {
          case 'Text':
            if (props.exam.answer.length === 1) {
              return (
                <span className={props.result?.at(0) ?? true ? '' : css.wrong}>{split_text(props.exam.answer[0])}</span>
              );
            }
            return (
              <ol>
                {props.exam.answer.map((e, i) => (
                  <li key={'result_select_' + i} className={props.result?.at(i) ?? true ? '' : css.wrong}>
                    {split_text(e)}
                  </li>
                ))}
              </ol>
            );
          case 'Select':
            return (
              <span className={`${css.answer_text} ${props.result?.at(0) ?? true ? '' : css.wrong}`}>
                {props.exam.question_choices?.at(Number(props.exam.answer[0]))}
              </span>
            );
          case 'MultiSelect':
            return (
              <ul>
                {props.exam.question_choices?.map((e, i) => (
                  <li
                    key={'result_multiselect_' + i}
                    className={`${css.answer_text} ${props.result?.at(i) ?? true ? '' : css.wrong} ${
                      props.exam.answer.indexOf(String(i)) === -1 ? css.multi_select_not_answer : ''
                    }`}
                  >
                    {e}
                  </li>
                ))}
              </ul>
            );
          case 'Sort':
            return (
              <ol>
                {props.exam.answer.map((e, i) => (
                  <li
                    key={'result_multiselect_' + i}
                    className={`${css.answer_text} ${props.result?.at(i) ?? true ? '' : css.wrong}`}
                  >
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
