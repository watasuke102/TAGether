// TAGether - Share self-made exam for classmates
// list.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/create.module.css';
import css_form from '../style/Form.module.css';
import React from 'react';
import Button from '../components/Button';
import Categoly from '../types/Categoly';

interface Exam {
  question: string,
  answer:   string
}

export default class create extends React.Component {
  constructor(props) {
    super(props);
    const categoly_default: Categoly = {
      id: 0, updated_at: '', title: '',
      desc: '', tag: '', list: ''
    }
    let tmp: Exam[] = [];
    tmp.push({question: '', answer: ''});
    this.state = {
      categoly: categoly_default,
      exam: tmp
    }
  }

  AddExam() {
    let tmp = this.state.exam;
    tmp.push({ question: '', answer: '' });
    this.setState({ exam: tmp });
  }
  
  ExamEditForm() {
    let obj: object[] = []
    this.state.exam.forEach(element => {
      obj.push(
        <div className={css.edit_exam}>
          <label>問題文<textarea className={css_form.form}/></label>
          <label>答え<textarea className={css_form.form}/></label>
        </div>
      );
    });
    return obj;
  }

  render() {
    return (
      <div className={css.container}>
        <h1>問題の新規登録</h1>

        <div className={css.edit_area}>
          <label>タイトル<textarea className={css_form.form}/></label>
          <label>説明<textarea className={css_form.form}/></label>
          <label>タグ (半角コンマ , で区切る)<textarea className={css_form.form}/></label>
        </div>

        <h2>問題</h2>
        {this.ExamEditForm()}
        
        <Button info={{
          text: "追加", icon: "fas fa-plus",
          onClick: () => this.AddExam(), type: "material"
        }} />
      </div>
    );
  }
}
