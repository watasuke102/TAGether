// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './ExamEditFormsOld.module.scss';
import React from 'react';
import Button from '@/common/Button/Button';
import Form from '@/common/TextForm/Form';
import Exam from '@mytypes/Exam';
import ExamOperateFunctionsType from '@mytypes/ExamOperateFunctionsType';

interface Props {
  exam: Exam[];
  updater: ExamOperateFunctionsType;
  register: () => void;
}

export default function ExamEditFormsOld(props: Props): React.ReactElement {
  let bottom_div: HTMLDivElement | null;
  let top_div: HTMLDivElement | null;

  return (
    <>
      <div className={css.top} ref={e => (top_div = e)} />
      {
        // メインの編集画面
        props.exam.map((e, i) => {
          return (
            <div className={css.exam_editform} key={`ansform_${i}`}>
              {/* 上部の移動・追加ボタン */}
              <div className={css.move_button}>
                {i !== 0 && (
                  <Button
                    {...{
                      text: '1つ上に移動',
                      icon: 'fas fa-caret-up',
                      OnClick: () => props.updater.Exam.Swap(i, i),
                      type: 'material',
                    }}
                  />
                )}
                <Button
                  {...{
                    text: '1つ上に追加',
                    icon: 'fas fa-plus',
                    OnClick: () => props.updater.Exam.Insert(i),
                    type: 'material',
                  }}
                />
              </div>

              {/* 問題文の編集欄 */}
              <div className={css.edit_exam}>
                <div className={css.delete_button}>
                  {/* 問題削除ボタン */}
                  {props.exam.length !== 1 && (
                    <Button
                      {...{
                        type: 'material',
                        icon: 'fas fa-trash',
                        text: '削除',
                        OnClick: () => props.updater.Exam.Remove(i),
                      }}
                    />
                  )}
                </div>
                <Form
                  {...{
                    label: '問題文',
                    value: e.question,
                    rows: 2,
                    OnChange: ev => props.updater.Question.Update(i, ev.target.value),
                  }}
                />

                {/* 答えの編集欄 */}
                <div className={css.answers}>
                  {e.answer.map((answer, j) => {
                    return (
                      <div className={css.answer_area} key={`ansarea_${j}`}>
                        <Form
                          {...{
                            label: '答え(' + (j + 1) + ')',
                            value: answer,
                            rows: 2,
                            OnChange: ev => props.updater.Answer.Update(i, j, ev.target.value),
                          }}
                        />
                        <div className={css.answer_area_buttons}>
                          {/* 問題の追加/削除 */}
                          <Button
                            {...{
                              text: '追加',
                              icon: 'fas fa-plus',
                              OnClick: () => props.updater.Answer.Insert(i, -1),
                              type: 'material',
                            }}
                          />
                          {
                            // 解答欄を1つ削除するボタン
                            // 解答欄が1つしかないときは無効
                            i !== 0 && (
                              <Button
                                {...{
                                  type: 'material',
                                  icon: 'fas fa-trash',
                                  text: '削除',
                                  OnClick: () => props.updater.Answer.Remove(i, j),
                                }}
                              />
                            )
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 下部の移動・追加ボタン */}
              <div className={css.move_button}>
                {i !== props.exam.length - 1 && (
                  <Button
                    {...{
                      text: '1つ下に移動',
                      icon: 'fas fa-caret-down',
                      OnClick: () => props.updater.Exam.Swap(i, i + 1),
                      type: 'material',
                    }}
                  />
                )}
                <Button
                  {...{
                    text: '1つ下に追加',
                    icon: 'fas fa-plus',
                    OnClick: () => props.updater.Exam.Insert(i + 1),
                    type: 'material',
                  }}
                />
              </div>

              <hr />
            </div>
          );
        })
      }
      <div className={css.bottom} ref={e => (bottom_div = e)} />

      {/* 画面下部ボタンコンテナ */}
      <div className={css.button_container}>
        <div className={css.buttons}>
          <Button
            {...{
              text: '下に追加',
              icon: 'fas fa-arrow-down',
              type: 'material',
              OnClick: () => {
                props.updater.Exam.Insert(-1);
                // 追加した問題欄が表示されるように下にスクロール
                bottom_div?.scrollIntoView({behavior: 'smooth'});
              },
            }}
          />
          <Button
            {...{
              text: '上に追加',
              icon: 'fas fa-arrow-up',
              type: 'material',
              OnClick: () => {
                props.updater.Exam.Insert(0);
                // 追加した問題欄が表示されるように上にスクロール
                top_div?.scrollIntoView({behavior: 'smooth'});
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
