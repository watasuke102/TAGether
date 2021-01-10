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
import Form from '../components/Form';
import Categoly from '../types/Categoly';

interface Exam {
  question: string,
  answer:   string
}

const categoly_default: Categoly = {
  id: 0, updated_at: '', title: '',
  desc: '', tag: '', list: ''
}

export default class create extends React.Component {
  constructor(props) {
    super(props);
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

  // state更新
  UpdateCategoly(type: string, str: string) {
    let tmp = categoly_default;
    switch (type) {
      case 'title': tmp.title = str; break;
      case 'desc':  tmp.desc  = str; break;
      case 'tag':   tmp.tag   = str; break;
    }
    this.setState({ categoly: tmp });
  }
  UpdateExam(type: string, i: number, str: string) {
    let tmp = this.state.exam;
    if (type == 'question') {
      tmp[i].question = str;
    } 
    if (type == 'answer') {
      tmp[i].answer = str;
    } 
    this.setState({ exam: tmp });
  }
  
  ExamEditForm() {
    let obj: object[] = []
    let i = 0;
    this.state.exam.forEach(element => {
      obj.push(
        <div className={css.edit_exam}>
          <Form info={{
            label: '問題文', value: element.question, disabled: false,
            onChange: (e) => this.UpdateExam('question', i, e.target.value)
          }}/>
          <Form info={{
            label: '答え', value: element.answer, disabled: false,
            onChange: (e) => this.UpdateExam('answer', i, e.target.value)
          }}/>
        </div>
      );
      i++;
    });
    return obj;
  }


  render() {
    return (
      <div className={css.container}>
        <h1>問題の新規登録</h1>

        <div className={css.edit_area}>
          <Form info={{
            label: 'タイトル', value: this.state.categoly.title, disabled: false,
            onChange: (e) => this.UpdateCategoly('title', e.target.value)
          }}/>
          <Form info={{
            label: '説明', value: this.state.categoly.desc, disabled: false,
            onChange: (e) => this.UpdateCategoly('desc', e.target.value)
          }}/>
          <Form info={{
            label: 'タグ (半角コンマ , で区切る)', value: this.state.categoly.tag, disabled: false,
            onChange: (e) => this.UpdateCategoly('tag', e.target.value)
          }}/>
        </div>

        <h2>問題</h2>
        {this.ExamEditForm()}
        
        <Button info={{
          text: "問題の追加", icon: "fas fa-plus",
          onClick: () => this.AddExam(), type: "material"
        }} />
      </div>
    );
  }
}
