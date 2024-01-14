// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './ExamPage.module.scss';
import scroll_area from '../ScrollArea.module.scss';
import React from 'react';
import {useImmerReducer} from 'use-immer';
import {ExamReducerContext, exam_reducer, init_state} from '../ExamReducer';
import {Result} from '../Result/Result';
import {ExamAnswerArea} from '../ExamAnswerArea/ExamAnswerArea';
import {ExamStatusList} from '../ExamStatusList/ExamStatusList';
import Button from '@/common/Button/Button';
import {useShortcut} from '@utils/useShortcut';
import {is_mobile_device} from '@utils/IsMobileDevice';
import {FmtCorrectAnswer} from '@/features/Exam/FmtCorrectAnswer/FmtCorrectAnswer';
import Exam from '@mytypes/Exam';
import ArrowLeftIcon from '@assets/arrow-left.svg';
import ArrowRightIcon from '@assets/arrow-right.svg';
import CircleIcon from '@assets/circle.svg';
import CheckIcon from '@assets/check.svg';
import MenuIcon from '@assets/menu.svg';
import {FinishModal} from '../FinishModal/FinishModal';
import ButtonInfo from '@mytypes/ButtonInfo';
import {new_history} from '@utils/api/history';
import {AllHistory} from '@mytypes/ExamHistory';

export type ExamPageProps = {
  title: string;
  exam: Exam[];
  history?: AllHistory;
};

export function ExamPage(props: ExamPageProps): JSX.Element {
  const [state, dispatch] = useImmerReducer(exam_reducer, init_state(props.exam));
  const inserted_history_id = React.useRef('');

  React.useEffect(() => {
    document.title = `(${state.index + 1} / ${props.exam.length}) : ${props.title} - TAGether`;
  }, [state.index]);
  useShortcut(
    [
      {keycode: 'KeyH', handler: () => dispatch({type: 'handle_button/prev'})},
      {keycode: 'ArrowLeft', handler: () => dispatch({type: 'handle_button/prev'})},
      {keycode: 'KeyL', handler: () => dispatch({type: 'handle_button/next'})},
      {keycode: 'ArrowRight', handler: () => dispatch({type: 'handle_button/next'})},
    ],
    {ctrl: true, shift: true},
  );

  React.useEffect(() => {
    if (state.exam_state.map(e => e.checked).includes(false)) {
      return;
    }
    new_history({
      exam: state.exam,
      exam_state: state.exam_state,
      redo_times: (props.history?.redo_times ?? -1) + 1,
      title: props.history ? `解き直し：${props.title}（${props.history.redo_times}回目）` : props.title,
    }).then(e => {
      inserted_history_id.current = e.data.inserted_id;
    });
  }, [state.exam_state]);

  return (
    <ExamReducerContext.Provider value={[state, dispatch]}>
      <div className={css.exam_area_wrapper}>
        <ExamStatusList />
        <section className={`${css.exam_area} ${is_mobile_device() ? css.exam_area_mobile : css.exam_area_normal}`}>
          <div className={css.button_container}>
            <div className={css.button_wrapper_left}>
              {is_mobile_device() && (
                <Button
                  type='material'
                  text=''
                  OnClick={() => document.documentElement.style.setProperty('--slide-amount', '0%')}
                  icon={<MenuIcon />}
                />
              )}
              {
                // 戻るボタンを非表示にする時、divを置いて次へボタンを右寄せ
                state.index !== 0 && (
                  <Button
                    type='material'
                    text={is_mobile_device() ? '' : '前の問題'}
                    OnClick={() => dispatch({type: 'handle_button/prev'})}
                    icon={<ArrowLeftIcon />}
                  />
                )
              }
            </div>
            <div className={css.current_index_status}>{`${state.index + 1} / ${state.exam.length}`}</div>
            <div className={css.button_wrapper_right}>
              {(() => {
                const common: Omit<ButtonInfo, 'text' | 'icon'> = {
                  type: 'material',
                  OnClick: () => dispatch({type: 'handle_button/next'}),
                };
                if (!state.exam_state[state.index].checked) {
                  return <Button text={is_mobile_device() ? '' : '答え合わせ'} icon={<CircleIcon />} {...common} />;
                }
                if (state.index === state.exam.length - 1) {
                  if (state.exam_state.filter(e => !e.checked).length === 0) {
                    return <Button text={is_mobile_device() ? '' : '終了'} icon={<CheckIcon />} {...common} />;
                  } else {
                    return <></>;
                  }
                }
                return <Button text={is_mobile_device() ? '' : '次の問題'} icon={<ArrowRightIcon />} {...common} />;
              })()}
            </div>
          </div>
          <div className={css.question}>{props.exam[state.index].question}</div>
          <div className={`${css.answer} ${scroll_area.scroll_area}`}>
            <ExamAnswerArea />
          </div>
          <div className={`${css.result} ${scroll_area.scroll_area}`}>
            {state.exam_state[state.index].checked && (
              <>
                <Result />
                <p className={css.result_label}>正解：</p>
                <FmtCorrectAnswer exam={props.exam[state.index]} result={state.exam_state[state.index].result} />
                {state.exam[state.index].comment && (
                  <>
                    <p className={css.result_label}>コメント：</p>
                    {state.exam[state.index].comment}
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </div>
      <FinishModal />
    </ExamReducerContext.Provider>
  );
}
