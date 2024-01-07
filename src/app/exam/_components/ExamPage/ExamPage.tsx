// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
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
import {ExamStatusList} from '../ExamStatusList/ExamStatusListPage';
import Button from '@/common/Button/Button';
import {useShortcut} from '@utils/useShortcut';
import {FmtCorrectAnswer} from '@/features/Exam/FmtCorrectAnswer/FmtCorrectAnswer';
import Exam from '@mytypes/Exam';
import ArrowLeftIcon from '@assets/arrow-left.svg';
import ArrowRightIcon from '@assets/arrow-right.svg';
import CircleIcon from '@assets/circle.svg';
import CheckIcon from '@assets/check.svg';

type Props = {
  title: string;
  exam: Exam[];
};

export function ExamPage(props: Props): JSX.Element {
  const [state, dispatch] = useImmerReducer(exam_reducer, init_state(props.exam));

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

  return (
    <ExamReducerContext.Provider value={[state, dispatch]}>
      <div className={css.exam_area_wrapper}>
        <ExamStatusList />
        <section className={css.exam_area}>
          <div className={css.question}>{props.exam[state.index].question}</div>
          <div className={`${css.answer} ${scroll_area.scroll_area}`}>
            <ExamAnswerArea />
          </div>
          <div className={`${css.result} ${scroll_area.scroll_area}`}>
            {state.exam_state[state.index].checked && (
              <>
                <Result />
                <p className={css.correct_answer_label}>正解：</p>
                <FmtCorrectAnswer exam={props.exam[state.index]} result={state.exam_state[state.index].result} />
              </>
            )}
          </div>
          <div className={css.button_container}>
            {
              // 戻るボタンを非表示にする時、divを置いて次へボタンを右寄せ
              state.index === 0 ? (
                <div></div>
              ) : (
                <Button
                  type='material'
                  text='前の問題'
                  OnClick={() => dispatch({type: 'handle_button/prev'})}
                  icon={<ArrowLeftIcon />}
                />
              )
            }
            <Button
              type='material'
              OnClick={() => dispatch({type: 'handle_button/next'})}
              {...(() => {
                if (!state.exam_state[state.index].checked) {
                  return {
                    text: '答え合わせ',
                    icon: <CircleIcon />,
                  };
                }
                if (state.index === state.exam.length - 1) {
                  return {
                    text: '終了',
                    icon: <CheckIcon />,
                  };
                }
                return {
                  text: '次の問題',
                  icon: <ArrowRightIcon />,
                };
              })()}
            />
          </div>
        </section>
      </div>
    </ExamReducerContext.Provider>
  );
}
