// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './ExamStatusList.module.scss';
import scroll_area from '../ScrollArea.module.scss';
import React from 'react';
import {ExamReducerContext} from '../ExamReducer';

export function ExamStatusList(): JSX.Element {
  const [state, dispatch] = React.useContext(ExamReducerContext);

  return (
    <section className={`${css.exam_status} ${scroll_area.scroll_area}`}>
      <div className={css.current_index_status}>{`${state.index + 1} / ${state.exam.length}`}</div>
      {state.exam_state.map((e, i) => (
        <span className={css.item} key={'exam_state_item-' + i} onClick={() => dispatch({type: 'index/set', index: i})}>
          {`0000${i}`.slice(-1 * String(state.exam.length).length)}：
          {(() => {
            if (!e.checked) {
              return '未回答';
            }
            if (e.total_question === 1) {
              return e.correct_count === 1 ? '正解' : '不正解';
            }
            return e.correct_count + '問正解';
          })()}
        </span>
      ))}
    </section>
  );
}
