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
import Exam from '../types/Exam';
import Categoly from '../types/Categoly';
import ModalData from '../types/ModalData';
import ButtonInfo from '../types/ButtonInfo';
import EditCategolyPageState from '../types/EditCategolyPageState';


// デフォルト値
function categoly_default() {
  let tmp: Categoly = {
    id: 0, updated_at: '', title: '',
    desc: '', tag: '', list: ''
  }
  return tmp;
}
function exam_default() {
  let tmp: Exam[] = [];
  tmp.push({ question: '', answer: Array<string>(1).fill('') });
  return tmp;
}

export default class create extends React.Component<any, EditCategolyPageState> {
  private bottom;
  private top;

  public text = {
    heading: '新規カテゴリの追加',
    api_success: 'カテゴリの追加に成功しました',
    AddNewCategoly: () => this.setState({
      isModalOpen: false,
      categoly: categoly_default(), exam: exam_default()
    })
  }
  public api_method = 'POST';

  constructor(props: EditCategolyPageState) {
    super(props);
    this.state = {
      categoly: categoly_default(),
      exam: exam_default(),
      isModalOpen: false, res_result: '',
      showConfirmBeforeLeave: true
    }
  }
  // ページ移動時に警告
  ShowAlertBeforeLeave() {
    if (!window.confirm("変更は破棄されます。ページを移動してもよろしいですか？")) {
      throw new Error('canceled');
    }
  }
  BeforeUnLoad = e => {
    if (!this.state.showConfirmBeforeLeave) return;
    e.preventDefault();
    e.returnValue = "変更は破棄されます。ページを移動してもよろしいですか？";
  }
  componentDidMount() {
    window.addEventListener('beforeunload', this.BeforeUnLoad);
    Router.events.on('routeChangeStart', this.ShowAlertBeforeLeave);
  }
  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.BeforeUnLoad);
    Router.events.off('routeChangeStart', this.ShowAlertBeforeLeave);
  }

  // カテゴリ登録
  RegistExam() {
    if (this.state.categoly.tag.split(',').length > 8) {
      this.setState({ isModalOpen: true, res_result: '{"status":"error","message":"タグは合計8個以下にしてください"}' })
      return;
    }
    if (this.state.categoly.title == '') {
      this.setState({ isModalOpen: true, res_result: '{"status":"error","message":"タイトルを設定してください"}' })
      return;
    }
    let f: boolean = false;
    this.state.exam.forEach(e => {
      if (e.question == '') {
        f = true;
        this.setState({ isModalOpen: true, res_result: '{"status":"error","message":"問題文が入力されていない欄があります"}' })
        return;
      }
      e.answer.forEach(answer => {
        if (answer == '') {
          f = true;
          this.setState({ isModalOpen: true, res_result: '{"status":"error","message":"答えが入力されていない欄があります"}' })
          return;
        }
      });
    });
    if (f) return;
    const exam = JSON.stringify(this.state.exam);
    const tmp: Categoly = this.state.categoly;
    const categoly = {
      id: tmp.id, title: tmp.title, desc: tmp.desc, tag: tmp.tag, list: exam
    }
    
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        const str = req.responseText;
        // エラーだったらページ移動確認ダイアログを表示
        const f = (JSON.parse(str).status == 'error');
        this.setState({
          isModalOpen: true, res_result: str,
          showConfirmBeforeLeave: f
        });
      }
    }
    const url = process.env.API_URL;
    if (url == undefined) {
      this.setState({ isModalOpen: true, res_result: '{"status":"error","message":"失敗しました: URL is undefined"}' })
      return;
    }
    categoly.list = categoly.list.replace(/(?<!\\)\\n/g, '\\\\n');
    req.open(this.api_method, url);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(categoly));
    console.log('DEBUG: '+JSON.stringify(categoly));
  }

  // 問題を追加
  AddExam(before: boolean) {
    let tmp = this.state.exam;
    if (before) {
      tmp.unshift({ question: '', answer: Array<string>(1).fill('') });
      // 追加した問題欄が表示されるように上にスクロール
      this.top.scrollIntoView({ behavior: 'smooth' });
    } else {
      tmp.push({ question: '', answer: Array<string>(1).fill('') });
      // 追加した問題欄が表示されるように下にスクロール
      this.bottom.scrollIntoView({ behavior: 'smooth' });
    }
    this.setState({ exam: tmp });
  }
  // 答え欄を追加
  AddAnswer(i: number) {
    let tmp = this.state.exam;
    tmp[i].answer.push('');
    this.setState({ exam: tmp });
    // 追加した答え欄が表示されるようにする
    this.bottom.scrollIntoView({ behavior: 'smooth' });
  }
  RemoveExam(i: number) {
    let tmp = this.state.exam;
    // tmp[i]から要素を1つ削除
    tmp.splice(i, 1);
    this.setState({ exam: tmp });
  }
  RemoveAnswer(i: number, j: number) {
    let tmp = this.state.exam;
    // tmp[i]から要素を1つ削除
    tmp[i].answer.splice(j, 1);
    this.setState({ exam: tmp });
  }

  // state更新
  UpdateCategoly(type: string, str: string) {
    let tmp = this.state.categoly;
    switch (type) {
      case 'title': tmp.title = str; break;
      case 'desc':  tmp.desc  = str; break;
      case 'tag':   tmp.tag   = str; break;
    }
    this.setState({ categoly: tmp });
  }
  UpdateExam(type: string, str: string, i: number, j: number) {
    let tmp = this.state.exam;
    if (type == 'question') {
      tmp[i].question = str;
    } 
    if (type == 'answer') {
      tmp[i].answer[j] = str;
    } 
    this.setState({ exam: tmp });
  }
  
  // 問題編集欄
  DeleteButton(f: Function, returnDummy: boolean) {
    if (this.state.exam.length == 1) {
      if (returnDummy)
        return <div className={css.dummy_button} />;
      else return;
    }
    else return (
      <Button {...{
        type: 'material', icon: 'fas fa-trash', text: '削除',
        onClick: () => f()
      }} />
    );
  }
  ExamEditForm() {
    let obj: object[] = [];
    this.state.exam.forEach((e, i) => {
      // 答え欄の生成
      let answer_form: object[] = [];
      e.answer.forEach((answer, j) => {
        answer_form.push(
          <div className={css.answer_area}>
            <Form {...{
              label: '答え', value: answer, rows: 2,
              onChange: (ev) => this.UpdateExam('answer', ev.target.value, i, j)
            }} />
            <div className={css.answer_area_buttons}>
              {/* 問題の追加/削除 */}
              <Button {...{
                text: '追加', icon: "fas fa-plus",
                onClick: () => this.AddAnswer(i), type: "material"
              }} />
              {/* 答え欄削除ボタン */}
              {
                this.DeleteButton(() => this.RemoveAnswer(i, j), false)
              }
            </div>
          </div>
        )
      })

      // 問題文と答え欄
      obj.push(
        <>
          <div className={css.edit_exam}>
            <div className={css.delete_button}>
              {/* 問題削除ボタン */}
              {
                this.DeleteButton(() => this.RemoveExam(i), true)
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
          <hr/>
        </>
      );
    })
    return obj;
  }

  // モーダルウィンドウの中身
  RegistResult() {
    let result;
    if (this.state.res_result != '') {
      result = JSON.parse(this.state.res_result);
    } else {
      // 何も中身がなければエラー時の値を代入する
      result = { status: 'error', message: '失敗しました' };
    }
    let message;
    let button_info: ButtonInfo[] = [];
    // 成功した場合、続けて追加/編集を続ける/カテゴリ一覧へ戻るボタンを表示
    if (result.status == 'ok') {
      message = this.text.api_success;
      button_info.push({
        type: 'material', icon: 'fas fa-arrow-right', text: '編集を続ける',
        onClick: () => this.setState({ isModalOpen: false })
      });
      button_info.push({
        type: 'material', icon: 'fas fa-plus', text: '新規カテゴリを追加',
        onClick: this.text.AddNewCategoly
      });
      button_info.push({
        type: 'filled', icon: 'fas fa-check', text: 'カテゴリ一覧へ',
        onClick: () => Router.push('/list')
      });
    } else {
      // 失敗した場合、閉じるボタンのみ
      message = 'エラー: ' + result.message;
      button_info.push({
        type: 'filled', icon: 'fas fa-times', text: '閉じる',
        onClick: () => this.setState({isModalOpen: false})
      });
    }

    let button: object[] = [];
    button_info.forEach(e => { button.push(<Button {...e} />) });
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
      body: this.RegistResult(),
      isOpen: this.state.isModalOpen,
      close:  () => this.setState({isModalOpen: false}),
    };
    return (
      <>
        <h1>{this.text.heading}</h1>

        <div className={css.edit_area}>
          <Form {...{
            label: 'タイトル', value: this.state.categoly.title, rows: 1,
            onChange: (e) => this.UpdateCategoly('title', e.target.value)
          }}/>
          <Form {...{
            label: '説明', value: this.state.categoly.desc, rows: 3,
            onChange: (e) => this.UpdateCategoly('desc', e.target.value)
          }}/>
          <Form {...{
            label: 'タグ (半角コンマ , で区切る)', value: this.state.categoly.tag, rows: 1,
            onChange: (e) => this.UpdateCategoly('tag', e.target.value)
          }}/>
        </div>

        <div className={css.top} ref={e => this.top = e} />

        <h2>問題</h2>

        {this.ExamEditForm()}

        <div className={css.bottom} ref={e => this.bottom = e} />
        
        <div className={css.button_container}>
          <div className={css.buttons}>
            <Button {...{
              text: "下に追加", icon: "fas fa-arrow-down",
              onClick: () => this.AddExam(false), type: "material"
            }} />
            <Button {...{
              text: "上に追加", icon: "fas fa-arrow-up",
              onClick: () => this.AddExam(true), type: "material"
            }} />
            <Button {...{
              text: '適用', icon: "fas fa-check",
              onClick: () => this.RegistExam(), type: "filled"
            }} />
          </div>
        </div>

        <Modal {...modalData} />
      </>
    );
  }
}
