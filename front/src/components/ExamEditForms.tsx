// TAGether - Share self-made exam for classmates
// ExamEditForms.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/pages/create.module.scss';
import React from 'react';
import CheckBox from "./CheckBox";
import Form from "./Form";
import Button from "./Button";
import Exam from "../types/Exam";

interface Props {
  exam: Exam[]
}

export default function ExamEditForms(props: Props): React.ReactElement {
  const [json_edit, SetJsonEdit] = React.useState(false);
  let bottom_div: HTMLDivElement | null;
  let top_div: HTMLDivElement | null;

  function ExamEditForm(): React.ReactElement[] {
    function DeleteButton(f: Function, isDeleteExam: boolean, i?: number): React.ReactElement | undefined {
      // 問題欄の削除ボタンであれば、全体の問題数の合計が1のときは非表示
      if (isDeleteExam) {
        if (props.exam.length == 1)
          return <div className={css.dummy_button} />;
      } else {
        // 解答欄の削除ボタンであれば、解答欄の合計が1のときは非表示
        if (i != undefined) {
          if (props.exam[i].answer.length == 1)
            return;
        }
      }
      return (
        <Button {...{
          type: 'material', icon: 'fas fa-trash', text: '削除',
          onClick: () => f()
        }} />
      );
    }

    const obj: React.ReactElement[] = [];
    props.exam.forEach((e, i) => {
      // 答え欄の生成
      const answer_form: React.ReactElement[] = [];
      e.answer.forEach((answer, j) => {
        answer_form.push(
          <div className={css.answer_area}>
            <Form {...{
              label: '答え(' + (j + 1) + ')', value: answer, rows: 2,
              onChange: (ev) => this.UpdateExam('answer', ev.target.value, i, j)
            }} />
            <div className={css.answer_area_buttons}>
              {/* 問題の追加/削除 */}
              <Button {...{
                text: '追加', icon: 'fas fa-plus',
                onClick: () => this.AddAnswer(i), type: 'material'
              }} />
              {/* 答え欄削除ボタン */}
              {
                DeleteButton(() => this.RemoveAnswer(i, j), false, i)
              }
            </div>
          </div>
        );
      });

      // 問題文と答え欄
      obj.push(
        <div className={css.exam_editform}>
          {/* 移動・追加ボタン */}
          <div className={css.move_button}>
            {
              (i != 0) && <Button {...{
                text: '1つ上に移動', icon: 'fas fa-caret-up',
                onClick: () => this.SwapExam(i, -1), type: 'material'
              }} />
            }
            <Button {...{
              text: '1つ上に追加', icon: 'fas fa-plus',
              onClick: () => this.InsertExam(i), type: 'material'
            }} />
          </div>

          <div className={css.edit_exam}>
            <div className={css.delete_button}>
              {/* 問題削除ボタン */}
              {
                DeleteButton(() => this.RemoveExam(i), true)
              }
            </div>
            <Form {...{
              label: '問題文', value: e.question, rows: 2,
              onChange: (ev) => this.UpdateExam('question', ev.target.value, i, -1)
            }} />

            <div className={css.answers}>
              {answer_form}
            </div>

          </div>

          {/* 移動・追加ボタン */}
          <div className={css.move_button}>
            {
              (i != props.exam.length - 1) && <Button {...{
                text: '1つ下に移動', icon: 'fas fa-caret-down',
                onClick: () => this.SwapExam(i, 1), type: 'material'
              }} />
            }
            <Button {...{
              text: '1つ下に追加', icon: 'fas fa-plus',
              onClick: () => this.InsertExam(i + 1), type: 'material'
            }} />
          </div>

          <hr />
        </div>
      );
    });
    return obj;
  }

  return (
    <>
      <div className={css.top} ref={e => top_div = e} />

      {json_edit ?
        <Form label='JSON' value={this.state.categoly.list} rows={30}
              onChange={(e) => this.UpdateCategoly('list', e.target.value)} />
        :
        <ExamEditForm />}

      <div className={css.bottom} ref={e => bottom_div = e} />

      <div className={css.button_container}>
        <div className={css.buttons}>
          <Button {...{
            text: '下に追加', icon: 'fas fa-arrow-down', type: 'material',
            onClick: () => {
              this.AddExam(false)
              // 追加した問題欄が表示されるように下にスクロール
              bottom_div?.scrollIntoView({ behavior: 'smooth' });
            }
          }} />
          <Button {...{
            text: '上に追加', icon: 'fas fa-arrow-up', type: 'material',
            onClick: () => {
              this.AddExam(true)
              // 追加した問題欄が表示されるように上にスクロール
              top_div?.scrollIntoView({behavior: 'smooth'});
            }
          }} />
          <Button {...{
            text: '適用', icon: 'fas fa-check',
            onClick: () => this.RegistExam(), type: 'filled'
          }} />
        </div>
      </div>
    </>
  )
}