// TAGether - Share self-made exam for classmates
// create.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/create.module.scss';
import React from 'react';
import Helmet from 'react-helmet';
import Router from 'next/router';
import Form from '../components/Form';
import Toast from '../components/Toast';
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
    document_title: '新規作成',
    heading: '新規カテゴリの追加',
    api_success: 'カテゴリの追加に成功しました',
    buttons: [
      {
        type: 'material', icon: 'fas fa-plus', text: '新規カテゴリを追加',
        onClick: () => this.setState({
          isModalOpen: false,
          categoly: categoly_default(), exam: exam_default()
        })
      },
      {
        type: 'filled', icon: 'fas fa-check', text: 'カテゴリ一覧へ',
        onClick: () => Router.push('/list')
      }
    ]
  }
  public api_method = 'POST';

  constructor(props: EditCategolyPageState) {
    super(props);
    this.state = {
      isToastOpen: false,
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

  RouterEventOn() {
    Router.events.on('routeChangeStart', this.ShowAlertBeforeLeave);
  }
  RouterEventOff() {
    Router.events.off('routeChangeStart', this.ShowAlertBeforeLeave);
  }
  componentDidMount() {
    window.addEventListener('beforeunload', this.BeforeUnLoad);
    this.RouterEventOn();
  }
  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.BeforeUnLoad);
    this.RouterEventOff();
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
        this.FinishedRegist(str);
        // エラーだったらページ移動確認ダイアログを無効化しない
        if (JSON.parse(str).status != 'error') {
          this.RouterEventOff();
          this.setState({ showConfirmBeforeLeave: false });
        }
      }
    }
    const url = process.env.API_URL;
    if (url == undefined) {
      this.setState({ isModalOpen: true, res_result: '{"status":"error","message":"失敗しました: URL is undefined"}' })
      return;
    }
    categoly.list = categoly.list.replace(/\\n/g, '\\\\n');
    req.open(this.api_method, url);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(categoly));
    console.log('DEBUG: ' + JSON.stringify(categoly));
  }
  FinishedRegist(str: string) {
    this.setState({ isModalOpen: true, res_result: str });
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
  // exam[i]とexam[i+moveto]を入れ替え
  SwapExam(i: number, moveto: number) {
    let result = this.state.exam;
    const tmp = result[i];
    result[i] = result[i + moveto];
    result[i + moveto] = tmp;
    this.setState({ exam: result });
  }

  // 答え欄を追加
  AddAnswer(i: number) {
    let tmp = this.state.exam;
    tmp[i].answer.push('');
    this.setState({ exam: tmp });
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
      case 'desc': tmp.desc = str; break;
      case 'tag': tmp.tag = str; break;
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
  DeleteButton(f: Function, isDeleteExam: boolean, i?: number) {
    // 問題欄の削除ボタンであれば、全体の問題数の合計が1のときは非表示
    if (isDeleteExam) {
      if (this.state.exam.length == 1)
        return <div className={css.dummy_button} />;
    } else {
      // 解答欄の削除ボタンであれば、解答欄の合計が1のときは非表示
      if (i != undefined) {
        if (this.state.exam[i].answer.length == 1)
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
  ExamEditForm() {
    let obj: object[] = [];
    this.state.exam.forEach((e, i) => {
      // 答え欄の生成
      let answer_form: object[] = [];
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
                text: '追加', icon: "fas fa-plus",
                onClick: () => this.AddAnswer(i), type: "material"
              }} />
              {/* 答え欄削除ボタン */}
              {
                this.DeleteButton(() => this.RemoveAnswer(i, j), false, i)
              }
            </div>
          </div>
        )
      })

      // 問題文と答え欄
      obj.push(
        <>
          <div className={css.move_button}>{
            (i != 0) && <Button {...{
              text: '1つ上に移動', icon: "fas fa-caret-up",
              onClick: () => this.SwapExam(i, -1), type: "material"
            }} />
          }</div>

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

          <div className={css.move_button}>{
            (i != this.state.exam.length - 1) && <Button {...{
              text: '1つ下に移動', icon: "fas fa-caret-down",
              onClick: () => this.SwapExam(i, 1), type: "material"
            }} />
          }</div>

          <hr />
        </>
      );
    })
    return obj;
  }

  // モーダルウィンドウの中身
  RegistResult(string_only?: boolean) {
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
      button_info = this.text.buttons;
    } else {
      // 失敗した場合、閉じるボタンのみ
      message = 'エラー: ' + result.message;
      button_info.push({
        type: 'filled', icon: 'fas fa-times', text: '閉じる',
        onClick: () => this.setState({ isModalOpen: false })
      });
    }
    if (string_only) {
      return message;
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
      close: () => this.setState({ isModalOpen: false }),
    };
    return (
      <>
        <Helmet title={`${this.text.document_title} - TAGether`} />

        <h1>{this.text.heading}</h1>

        <ul>
          <li>記号 " は使用できません </li>
          <li>
            記号 \ を表示したいときは \\ のように入力してください<br />
            \\ 以外で記号 \ を使用しないでください。問題を開けなくなります
          </li>
          <li>
            「答え」の欄に&を入れると、複数の正解を作ることが出来ます<br />
            例: 「A&B&C」→解答欄にAもしくはBもしくはCのどれかが入力されたら正解
          </li>
        </ul>

        <div className={css.edit_area}>
          <Form {...{
            label: 'タイトル', value: this.state.categoly.title, rows: 1,
            onChange: (e) => this.UpdateCategoly('title', e.target.value)
          }} />
          <Form {...{
            label: '説明', value: this.state.categoly.desc, rows: 3,
            onChange: (e) => this.UpdateCategoly('desc', e.target.value)
          }} />
          <Form {...{
            label: 'タグ (半角コンマ , で区切る)', value: this.state.categoly.tag, rows: 1,
            onChange: (e) => this.UpdateCategoly('tag', e.target.value)
          }} />
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
        <Toast
          isOpen={this.state.isToastOpen}
          stateChange={() => this.setState({ isToastOpen: false })}
        >
          <div className={css.toast_body}>
            <span className='fas fa-bell' />
            {this.RegistResult(true)}
          </div>
        </Toast>
      </>
    );
  }
}
