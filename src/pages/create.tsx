// TAGether - Share self-made exam for classmates
// create.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/create.module.css';
import React from 'react';
import Router from 'next/router';
import Form from '../components/Form';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Categoly from '../types/Categoly';
import ModalData from '../types/ModalData';
import ButtonInfo from '../types/ButtonInfo';

interface Exam {
  question: string,
  answer:   string
}

function categoly_default() {
  let tmp: Categoly = {
    id: 0, updated_at: '', title: '',
    desc: '', tag: '', list: ''
  }
  return tmp;
}

function exam_default() {
  let tmp: Exam[] = [];
  tmp.push({ question: '', answer: '' });
  return tmp;
}

export default class create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoly: categoly_default(),
      exam: exam_default(),
      isModalOpen: false, res_result: ''
    }
  }

  // カテゴリ登録
  RegistExam() {
    if (this.state.categoly.title == '') {
      this.setState({ isModalOpen: true, res_result: '{"status":"error","message":"タイトルを設定してください"}' })
      return;
    }
    let f: boolean = false;
    this.state.exam.forEach(e => {
      console.log(e);
      if (e.question == '') {
        f = true;
        this.setState({ isModalOpen: true, res_result: '{"status":"error","message":"問題文が入力されていない欄があります"}' })
        return;
      }
      if (e.answer == '') {
        f = true;
        this.setState({ isModalOpen: true, res_result: '{"status":"error","message":"答えが入力されていない欄があります"}' })
        return;
      }
    });
    if (f) return;
    const exam = JSON.stringify(this.state.exam);
    const tmp: Categoly = this.state.categoly;
    const categoly = {
      title: tmp.title, desc: tmp.desc, tag: tmp.tag, list: exam
    }
    
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        const str = req.responseText;
        this.setState({ isModalOpen: true, res_result: str });
      }
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
  RemoveExam(i: number) {
    let tmp = this.state.exam;
    // tmp[i]から要素を1つ削除
    tmp.splice(i, 1);
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
  DeleteButton(i: number) {
    if (i == 0) return <div className={css.dummy_button} />;
    else return (
      <Button info={{
        type: 'material', icon: 'fas fa-trash', text: '削除',
        onClick: () => this.RemoveExam(i)
      }} />
    );
  }
  ExamEditForm() {
    let obj: object[] = [];
    for (let i = 0; i < this.state.exam.length;i++){
      obj.push(
        <div className={css.edit_exam}>
          <div className={css.delete_button}>
            {this.DeleteButton(i)}
          </div>

          <Form info={{
            label: '問題文', value: this.state.exam[i].question, rows: 2,
            onChange: (e) => this.UpdateExam('question', i, e.target.value)
          }}/>
          <Form info={{
            label: '答え', value: this.state.exam[i].answer, rows: 2,
            onChange: (e) => this.UpdateExam('answer', i, e.target.value)
          }}/>
        </div>
      );
    }
    return obj;
  }

  // モーダルウィンドウの中身
  RegistResult() {
    // 何も中身がなければ終了
    if (this.state.res_result == '') return <></>;
    const result = JSON.parse(this.state.res_result);
    let message;
    let button_info: ButtonInfo[] = [];
    // 成功した場合、続けて追加/カテゴリ一覧へ戻るボタンを表示
    if (result.status == 'ok') {
      message = 'カテゴリの追加に成功しました';
      button_info.push({
        type: 'material', icon: 'fas fa-arrow-right', text: '続けて追加',
        onClick: () => this.setState({
          isModalOpen: false,
          categoly: categoly_default(), exam: exam_default()
        })
      });
      button_info.push({
        type: 'filled', icon: 'fas fa-check', text: 'カテゴリ一覧へ',
        onClick: () => Router.push('/list')
      });
    // 失敗した場合、閉じるボタンのみ
    } else {
      message = 'エラー: ' + result.message;
      button_info.push({
        type: 'filled', icon: 'fas fa-times', text: '閉じる',
        onClick: () => this.setState({isModalOpen: false})
      });
    }

    let button: object[] = [];
    button_info.forEach(e => { button.push(<Button info={e} />) });
    return (
      <div className={css.window}>
        <p>{message}</p>
        <div className={css.window_buttons}>
          {button}
        </div>
      </div>
    );
  }

  render() {
    // Modalに渡す用のデータ
    const modalData: ModalData = {
      //body: <p>{this.state.res_result}</p>,
      body: this.RegistResult(),
      isOpen: this.state.isModalOpen
    };
    return (
      <>
        <h1>新規カテゴリの登録</h1>

        <div className={css.edit_area}>
          <Form info={{
            label: 'タイトル', value: this.state.categoly.title, rows: 1,
            onChange: (e) => this.UpdateCategoly('title', e.target.value)
          }}/>
          <Form info={{
            label: '説明', value: this.state.categoly.desc, rows: 3,
            onChange: (e) => this.UpdateCategoly('desc', e.target.value)
          }}/>
          <Form info={{
            label: 'タグ (半角コンマ , で区切る)', value: this.state.categoly.tag, rows: 1,
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

        <Modal data={modalData} />
      </>
    );
  }
}
