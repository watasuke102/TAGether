// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './ExamStatusList.module.scss';
import scroll_area from '../ScrollArea.module.scss';
import CloseIcon from '@assets/close.svg';
import React from 'react';
import Draggable from 'react-draggable';
import Button from '@/common/Button/Button';
import {is_mobile_device} from '@utils/IsMobileDevice';
import {ExamReducerContext} from '../ExamReducer';

const CONTAINER_ID = 'ExamStatusList_container';
export function ExamStatusList(): JSX.Element {
  const [state, dispatch] = React.useContext(ExamReducerContext);
  const draggable_ref = React.useRef<HTMLDivElement>(null);
  // iPadOSで確かめた際、transitionプロパティのせいで動きがガタガタしていたため、
  // ドラッグ中はアニメーションを無効化する
  const [is_dragging, set_is_dragging] = React.useState(false);

  function close() {
    is_first_click.current = true;
    document.documentElement.style.setProperty('--slide-amount', '-100%');
  }
  function slide_rate(x: number): number {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) {
      return 0;
    }
    return (x / container.clientWidth) * 100;
  }

  // メニューを開くためのクリックを無視する
  const is_first_click = React.useRef(true);
  React.useEffect(() => {
    const close_when_outside_clicked = (e: MouseEvent) => {
      const container = document.getElementById(CONTAINER_ID);
      if (!container) return;
      const drag_amount = Number(document.documentElement.style.getPropertyValue('--slide-amount').slice(0, -1));
      // これが初クリックで、メニューが開かれている→このクリックはメニュー開閉のためのクリック
      if (is_first_click.current && Number.isInteger(drag_amount) && drag_amount >= 0) {
        is_first_click.current = false;
        return;
      }
      // 開いている時に外側をクリックした
      if (!container.contains(e.target as Node)) {
        is_first_click.current = true;
        close();
      }
    };
    document.addEventListener('click', close_when_outside_clicked);
    return () => document.removeEventListener('click', close_when_outside_clicked);
  }, []);

  return (
    <>
      <section
        id={CONTAINER_ID}
        className={`${css.exam_status} ${scroll_area.scroll_area}
        ${is_mobile_device() ? css.mobile : css.normal}
        ${is_dragging ? '' : css.transform_animation}`}
      >
        {is_mobile_device() && (
          <div className={css.mobile_header}>
            <span>解答状況</span>
            <Button variant='material' text='' OnClick={close} icon={<CloseIcon />} />
          </div>
        )}
        {state.exam_state.map((e, i) => {
          const index_str = `0000${i + 1}`.slice(-1 * String(state.exam.length).length);
          const status = (() => {
            if (!e.checked) {
              return '未回答';
            }
            if (e.total_question === 1) {
              return e.correct_count === 1 ? '正解' : '不正解';
            }
            return e.correct_count + '問正解';
          })();
          return (
            <span
              className={`${css.item} ${e.checked ? '' : css.yet}`}
              key={'exam_state_item-' + i}
              onClick={() => {
                dispatch({type: 'index/set', index: i});
                close();
              }}
            >
              {`${index_str} : ${status}`}
            </span>
          );
        })}
      </section>
      {is_mobile_device() && (
        <>
          <div className={`${css.overray} ${is_dragging ? '' : css.transform_animation}`} />
          <Draggable
            nodeRef={draggable_ref}
            axis='x'
            position={{x: 0, y: 0}}
            onDrag={(_, e) => {
              document.documentElement.style.setProperty('--slide-amount', `${slide_rate(e.x) - 100}%`);
            }}
            onStart={() => set_is_dragging(true)}
            onStop={(_, e) => {
              set_is_dragging(false);
              const is_enough_to_open = slide_rate(e.x) > 50;
              document.documentElement.style.setProperty('--slide-amount', `${is_enough_to_open ? '0' : '-100'}%`);
              if (is_enough_to_open) {
                // FIXME?
                // eslint-disable-next-line react-hooks/immutability
                is_first_click.current = false;
              }
            }}
          >
            <div className={css.draggable} ref={draggable_ref} />
          </Draggable>
        </>
      )}
    </>
  );
}
