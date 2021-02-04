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
import CategolyManager from '../components/CategolyManager';
import Form from '../components/Form';
import Modal from '../components/Modal';
import Button from '../components/Button';
import ModalData from '../types/ModalData';
import ButtonInfo from '../types/ButtonInfo';
import EditCategolyPageState from '../types/EditCategolyPageState';

export default class create extends React.Component<any, EditCategolyPageState> {
  private bottom;
  public text = {
    heading: '新規カテゴリの追加',
    api_success: 'カテゴリの追加に成功しました',
    AddNewCategoly: () => {
      this.setState({ isModalOpen: false });
      this.state.categolyManager.InitToDefault();
    }
  }
  public api_method = 'POST';

  constructor(props: EditCategolyPageState) {
    super(props);
    this.state = {
      categolyManager: new CategolyManager,
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
    if (this.state.categolyManager.tag().split(',').length > 8) {
      this.setState({ isModalOpen: true, res_result: '{"status":"error","message":"タグは合計8個以下にしてください"}' })
      return;
    }
    if (this.state.categolyManager.title() == '') {
      this.setState({ isModalOpen: true, res_result: '{"status":"error","message":"タイトルを設定してください"}' })
      return;
    }
    let f: boolean = false;
    this.state.categolyManager.examlist().forEach(e => {
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

    const body = this.state.categolyManager.json_str();
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
    req.open(this.api_method, url);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(body);
    console.log('DEBUG: '+body);
  }
  
  // 問題編集欄
  DeleteButton(f: Function, returnDummy: boolean) {
    if (this.state.categolyManager.examlist().length == 1) {
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
    this.state.categolyManager.examlist().forEach((e, i) => {
      // 答え欄の生成
      let answer_form: object[] = [];
      e.answer.forEach((answer, j) => {
        answer_form.push(
          <div className={css.answer_area}>
            <Form {...{
              label: '答え', value: answer, rows: 2,
              onChange: (ev) => this.state.categolyManager.UpdateExam('answer', ev.target.value, i, j)
            }} />
            <div className={css.answer_area_buttons}>
              {/* 問題の追加/削除 */}
              <Button {...{
                text: '追加', icon: "fas fa-plus",
                onClick: () => this.state.categolyManager.AddAnswer(i), type: "material"
              }} />
              {/* 答え欄削除ボタン */}
              {
                this.DeleteButton(() => this.state.categolyManager.RemoveAnswer(i, j), false)
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
                this.DeleteButton(() => this.state.categolyManager.RemoveExam(i), true)
              }
            </div>
            <Form {...{
              label: '問題文', value: e.question, rows: 2,
              onChange: (ev) => this.state.categolyManager.UpdateExam('question', ev.target.value, i, -1)
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
            label: 'タイトル', value: this.state.categolyManager.title(), rows: 1,
            onChange: (e) => this.state.categolyManager.UpdateCategoly('title', e.target.value)
          }}/>
          <Form {...{
            label: '説明', value: this.state.categolyManager.desc(), rows: 3,
            onChange: (e) => this.state.categolyManager.UpdateCategoly('desc', e.target.value)
          }}/>
          <Form {...{
            label: 'タグ (半角コンマ , で区切る)', value: this.state.categolyManager.tag(), rows: 1,
            onChange: (e) => this.state.categolyManager.UpdateCategoly('tag', e.target.value)
          }}/>
        </div>

        <h2>問題</h2>
        {this.ExamEditForm()}

        <div className={css.bottom} ref={e => this.bottom = e} />
        
        <div className={css.button_container}>
          <div className={css.buttons}>
            <Button {...{
              text: "下に追加", icon: "fas fa-arrow-down", type: "material",
              onClick: () => {
                this.state.categolyManager.AddExam(false);
                // 追加した問題欄が表示されるようにする
                this.bottom.scrollIntoView({ behavior: 'smooth' });
              }
            }} />
            <Button {...{
              text: "上に追加", icon: "fas fa-arrow-up",
              onClick: () => this.state.categolyManager.AddExam(true), type: "material"
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
