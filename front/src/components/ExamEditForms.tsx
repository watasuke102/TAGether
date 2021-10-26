// TAGether - Share self-made exam for classmates
// ExamEditForms.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/components/ExamEditForm.module.scss';
import React from 'react';
import Exam from "../types/Exam";
import Form from "./Form";
import UpdateExam from "../ts/UpdateExam";
import Button from "./Button";
import ButtonContainer from "./ButtonContainer";

interface Props {
  exam: Exam[]
  updater: Function
  register: () => void
}

export default function ExamEditForms(props: Props): React.ReactElement {
  const [current_page, SetCurrentPage] = React.useState(0);
  // ショートカットキー
  function Shortcut(e: KeyboardEvent): void {
    // Ctrl+Shift+矢印キー等で動かす （キーリピートは無視）
    if (e.ctrlKey && e.shiftKey && !e.repeat) {
      if (e.code == 'KeyH' || e.code == 'ArrowLeft') {
        PrevPage();
      }
      else if (e.code == 'KeyL' || e.code == 'ArrowRight') {
        NextPage();
      }
    }
  }
  function NextPage() {
    if (current_page === props.exam.length - 1) return;
    SetCurrentPage(current_page+1);

  }
  function PrevPage() {
    if (current_page === 0) return;
    SetCurrentPage(current_page-1);
  }

  React.useEffect(() => {
      window.addEventListener('keydown', e => Shortcut(e));
    return () =>
      window.removeEventListener('keydown', e => Shortcut(e));
  }, []);


  return (
    <>
      <div className={css.button_list}>
        <div className={css.button_container}>
          <Button type={'material'} icon={'fas fa-chevron-left'} text={''}
                  onClick={PrevPage} />
          <Button type={'material'} icon={'fas fa-trash'} text={'この問題を削除'}
                  onClick={NextPage} />
          <span>{current_page+1}/{props.exam.length}</span>
          <Button type={'filled'} icon={'fas fa-check'} text={'編集を適用'}
                  onClick={props.register} />
          <Button type={'material'} icon={'fas fa-chevron-right'} text={''}
                  onClick={NextPage}/>
        </div>

        <div className={css.append_exam}>
          <ButtonContainer>
            <Button type={'material'} icon={'fas fa-angle-double-left'} text={'最初に挿入'}
                    onClick={() => {UpdateExam(props.updater, props.exam).Exam.Insert(0); NextPage();}} />
            <Button type={'material'} icon={'fas fa-arrow-left'} text={'1つ前に挿入'}
                    onClick={() => {UpdateExam(props.updater, props.exam).Exam.Insert(current_page); NextPage();}} />
            <Button type={'material'} icon={'fas fa-arrow-right'} text={'1つ後に挿入'}
                    onClick={() => UpdateExam(props.updater, props.exam).Exam.Insert(current_page+1)} />
            <Button type={'material'} icon={'fas fa-angle-double-right'} text={'最後に挿入'}
                    onClick={() => UpdateExam(props.updater, props.exam).Exam.Insert(-1)} />
          </ButtonContainer>
        </div>
      </div>

      {/* 問題文の編集欄（左側） */}
      <div className={css.form_container}>
        <div className={css.question}>
          <Form {...{
            label: '問題文', value: props.exam[current_page].question, rows: 6,
            onChange: (ev) => UpdateExam(props.updater, props.exam).Question.Update(current_page, ev.target.value)
          }} />
        </div>

        {/* 答え編集欄（右側） */}
        <div className={css.answer_list}>{
          props.exam[current_page].answer.map((e, i) => {
            return (
              <div className={css.answer}>
                <Form {...{
                  label: '答え(' + (i + 1) + ')', value: e, rows: 3,
                  onChange: (ev) => UpdateExam(props.updater, props.exam).Answer.Update(current_page, i, ev.target.value)
                }} />
                <div className={css.answer_area_buttons}>
                  {/* 問題の追加/削除 */}
                  <Button {...{
                    text: '追加', icon: 'fas fa-plus',
                    onClick: () => UpdateExam(props.updater, props.exam).Answer.Insert(current_page, -1), type: 'material'
                  }} />
                  {
                    // 解答欄を1つ削除するボタン
                    // 解答欄が1つしかないときは無効
                    (i !== 0) &&
                    <Button {...{
                      type: 'material', icon: 'fas fa-trash', text: '削除',
                      onClick: () => UpdateExam(props.updater, props.exam).Answer.Remove(current_page, i)
                    }} />
                  }
                </div>
              </div>
            );
        })}
        </div>
      </div>
    </>
  );
}