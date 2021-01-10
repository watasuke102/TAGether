// TAGether - Share self-made exam for classmates
// exam.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/exam.module.css'
import React from 'react';
import Router from 'next/router';
import { GetServerSideProps } from 'next';
import Modal from '../components/Modal';
import Button from '../components/Button';
import ModalData from '../types/ModalData';

enum NextButtonState {
  show_answer,
  next_question,
  finish_exam
}

export default class list extends React.Component {
  private exam;
  constructor(props) {
    super(props);
    this.UpdateUsersResponse = this.UpdateUsersResponse.bind(this);
    this.exam = JSON.parse(this.props.data[0].list);
    this.state = {
      index: 0, isModalOpen: false,
      next_button_state: NextButtonState.show_answer,
      responses: Array(this.exam.length), input: ''
    };
  }
  // indexを増減する
  SetIndex(i: number) {
    // 入力欄を変更する
    let input = '';
    if (this.state.responses[i]) {
      input = this.state.responses[i];
    }
    this.setState({
      index: i,
      input: input,
      next_button_state: NextButtonState.show_answer
    });
  }
  IncrementIndex() {
    switch (this.state.next_button_state) {
      // 答えを表示、答え合わせをする
      case NextButtonState.show_answer:
        this.setState({ next_button_state: NextButtonState.next_question });
        // 最後の問題であれば、ボタンの内容を変化させる
        if (this.state.index == this.exam.length - 1) {
          this.setState({ next_button_state: NextButtonState.finish_exam });
        }
        break;
        
        // 次の問題へ進む
        case NextButtonState.next_question:
        // indexの変更
        this.SetIndex(this.state.index + 1);
        break;
    
      // 終了ボタンを押したらモーダルウィンドウを表示
      case NextButtonState.finish_exam:
        this.setState({ isModalOpen: true });
        break;
    }
  }
  DecrementIndex() {
    if (this.state.index == 0) return;
    // indexの変更
    this.SetIndex(this.state.index - 1);
  }

  // ユーザーの入力（問題への解答）を配列に入れる
  UpdateUsersResponse(event) {
    let tmp = this.state.responses;
    tmp[this.state.index] = event.target.value;
    this.setState({ responses: tmp, input: event.target.value});
    console.log(this.state.responses);
  }

  // 最初の要素だった場合はボタンを非表示に
  // 次へボタンを右に寄せて表示するため、divを返す
  BackButton() {
    if (this.state.index == 0) return(<div></div>);
    else return (
      <Button info={{
        text: '戻る', icon: 'fas fa-arrow-left',
        onClick: () => this.DecrementIndex(), type: 'material'
      }} />
    );
  }
  NextButton() {
    let text: string, icon: string;
    switch (this.state.next_button_state) {
      case NextButtonState.show_answer:
        text = '答え合わせ'; icon = 'far fa-circle';
        break;
        case NextButtonState.next_question:
        text = '次へ'; icon = 'fas fa-arrow-right';
        break;
        case NextButtonState.finish_exam:
        text = '終了'; icon = 'fas fa-check';
        break;
    }
    return (
      <Button info={{
        text: text, icon: icon,
        onClick: () => this.IncrementIndex(), type: 'material'
      }} />
    );
  }

  // 問題をとき終わったときに表示するウィンドウ
  FinishWindow() {
    return (
      <div className={css.window}>
        <h1>🎉問題終了🎉</h1>
        <p>お疲れさまでした。</p>
        <div className={css.window_buttons}>
        <Button info={{
          text: 'ウィンドウを閉じる', icon: 'fas fa-times',
          onClick: () => this.setState({isModalOpen: false}), type: 'material'
        }} />
        <Button info={{
          text: '問題一覧へ戻る', icon: 'fas fa-undo',
          onClick: () => Router.push('/list'), type: 'material'
        }} />
        </div>
      </div>
    );
  }

  render() {
    // Modalに渡す用のデータ
    const modalData: ModalData = {
      body: this.FinishWindow(),
      isOpen: this.state.isModalOpen
    };
    
    return (
      <>
        <h1>exam</h1>

        <div className={css.display}>
          <p>{this.exam[this.state.index].question}</p>
        </div>

        <form className={css.form}>
          <label>解答: </label>
          <input type='text' value={this.state.input}
            onChange={(e) => this.UpdateUsersResponse(e)}
          />
          {/* 入力中エンターを押して送信を無効化 */}
          <input id={css.dummy} />
        </form>

        <div className={css.buttons}>
          {this.BackButton()}
          {this.NextButton()}
        </div>

        <Modal data={modalData} />
 
      </>
    );
  }
}

// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch('http://api.watasuke.tk?id=' + context.query.id);
  const data = await res.json();
  return {props:{data}};
}