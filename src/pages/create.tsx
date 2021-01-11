// TAGether - Share self-made exam for classmates
// list.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/create.module.css';
import React from 'react';
import Button from '../components/Button';
import Form from '../components/Form';
import Categoly from '../types/Categoly';
import { request } from 'https';

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

  // カテゴリ登録
  RegistExam() {
    const exam = JSON.stringify(this.state.exam);
    const tmp: Categoly = this.state.categoly;
    const categoly = {
      title: tmp.title, desc: tmp.desc, tag: tmp.tag, list: exam
    }
    
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (this.readyState == 4)
        console.log('status: '+req.responseText);
    }
    req.open('POST', 'https://api.watasuke.tk');
    req.setRequestHeader('Content-Type', 'application/json');
    console.log(req);
    console.log(JSON.stringify(categoly));
    req.send(JSON.stringify(categoly));
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
  
  // 問題編集欄
  ExamEditForm() {
    let obj: object[] = [];
    for (let i = 0; i < this.state.exam.length;i++){
      obj.push(
        <div className={css.edit_exam}>
          <Form info={{
            label: '問題文', value: this.state.exam[i].question, disabled: false,
            onChange: (e) => this.UpdateExam('question', i, e.target.value)
          }}/>
          <Form info={{
            label: '答え', value: this.state.exam[i].answer, disabled: false,
            onChange: (e) => this.UpdateExam('answer', i, e.target.value)
          }}/>
        </div>
      );
    }
    return obj;
  }

  render() {
    return (
      <div className={css.container}>
        <h1>新規カテゴリの登録</h1>

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
        
        <div className={css.buttons}>
          <Button info={{
            text: "問題の追加", icon: "fas fa-plus",
            onClick: () => this.AddExam(), type: "material"
          }} />
          <Button info={{
            text: "カテゴリの登録", icon: "fas fa-check",
            onClick: () => this.RegistExam(), type: "filled"
          }} />
        </div>
      </div>
    );
  }
}
