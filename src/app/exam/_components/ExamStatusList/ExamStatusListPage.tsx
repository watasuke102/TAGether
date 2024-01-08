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
import {is_mobile_device} from '@utils/IsMobileDevice';
import Button from '@/common/Button/Button';
import CloseIcon from '@assets/close.svg';
import Draggable from 'react-draggable';

const CONTAINER_ID = 'ExamStatusList_container';
export function ExamStatusList(): JSX.Element {
  const [state, dispatch] = React.useContext(ExamReducerContext);
  const close = () => document.documentElement.style.setProperty('--slide-amount', '-100%');

  return (
    <>
      <section
        id={CONTAINER_ID}
        className={`${css.exam_status} ${scroll_area.scroll_area} ${is_mobile_device() ? css.mobile : css.normal}`}
      >
        {is_mobile_device() && (
          <div className={css.mobile_header}>
            <span>解答状況</span>
            <Button type='material' text='' OnClick={close} icon={<CloseIcon />} />
          </div>
        )}
        {state.exam_state.map((e, i) => (
          <span
            className={css.item}
            key={'exam_state_item-' + i}
            onClick={() => {
              dispatch({type: 'index/set', index: i});
              close();
            }}
          >
            {`0000${i + 1}`.slice(-1 * String(state.exam.length).length)}：
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
    </>
  );
}
