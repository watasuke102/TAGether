// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './ExamPage.module.scss';
import React from 'react';
import Exam from '@mytypes/Exam';
import Button from '@/common/Button/Button';
import ArrowLeftIcon from '@assets/arrow-left.svg';
import ArrowRightIcon from '@assets/arrow-right.svg';

type Props = {
  title: string;
  exam: Exam[];
};

export function ExamPage(props: Props): JSX.Element {
  const [index, _set_index] = React.useState(0);
  const handle_index_update_button = React.useCallback(
    (action: number | 'prev' | 'next') => {
      if (action === 'prev' && index > 0) {
        _set_index(i => i - 1);
      }
      if (action === 'next' && index < props.exam.length - 1) {
        _set_index(i => i + 1);
      }
      if (Number.isInteger(action)) {
        _set_index(action);
      }
    },
    [index, props.exam],
  );

  React.useEffect(() => {
    document.title = `(${index + 1} / ${props.exam.length}) : ${props.title} - TAGether`;
  }, [index]);

  return (
    <>
      <div className={css.exam_area_wrapper}>
        <section className={`${css.exam_status} ${css.scroll_area}`}>
          <div className={css.current_index_status}>{`${index + 1} / ${props.exam.length}`}</div>
          {[...Array(1000)].map((e, i) => (
            <span key={i}>{`00${i}`.slice(-3)}：1000問正解</span>
          ))}
        </section>
        <section className={css.exam_area}>
          <div className={css.question}>
            {props.exam[index].question}
            {'00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'}
          </div>
          <div className={`${css.answer} ${css.scroll_area}`}>
            {[...Array(100)].map((e, i) => (
              <>
                <span key={i}>
                  {`00${i}`.slice(-3)}:{'0000000000000000000000000000000000000000000000000000' + i * i * i}
                </span>
                <br />
              </>
            ))}
            answer
          </div>
          <div className={`${css.result} ${css.scroll_area}`}>
            {[...Array(100)].map((e, i) => (
              <>
                <span key={i}>
                  {`00${i}`.slice(-3)}:
                  {'0000000000000000000012345678901234500000000000000000000000000000000' + i * i * i}
                </span>
                <br />
              </>
            ))}
            result
          </div>
          <div className={css.button_container}>
            <Button
              type='material'
              text='戻る'
              OnClick={() => handle_index_update_button('prev')}
              icon={<ArrowLeftIcon />}
            />
            <Button
              type='material'
              text='次へ'
              OnClick={() => handle_index_update_button('next')}
              icon={<ArrowRightIcon />}
            />
          </div>
        </section>
      </div>
    </>
  );
}
