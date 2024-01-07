// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './Result.module.scss';
import React from 'react';
import {ExamReducerContext} from '../ExamReducer';
import CircleIcon from '@assets/circle.svg';
import CrossIcon from '@assets/close.svg';
import TriangleIcon from '@assets/triangle.svg';

export function Result(): JSX.Element {
  const [state] = React.useContext(ExamReducerContext);
  const status = state.exam_state[state.index];

  if (!status.checked) {
    return <></>;
  }
  return (
    <section>
      <div className={css.result_container}>
        {(() => {
          if (status.correct_count === status.total_question) {
            return (
              <>
                <div className={css.result_icon_correct}>
                  <CircleIcon />
                </div>
                <span className={css.result_text}>正解</span>
              </>
            );
          }
          if (status.correct_count === 0) {
            return (
              <>
                <div className={css.result_icon_wrong}>
                  <CrossIcon />
                </div>
                <span className={css.result_text}>不正解</span>
              </>
            );
          }
          return (
            <>
              <div className={css.result_icon_partial}>
                <TriangleIcon />
              </div>
              <span className={css.result_text}>{status.correct_count}問正解</span>
            </>
          );
        })()}
      </div>
    </section>
  );
}
