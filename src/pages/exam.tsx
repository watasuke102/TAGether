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

export default class list extends React.Component {
  private exam;
  constructor(props) {
    super(props);
    this.UpdateUsersResponse = this.UpdateUsersResponse.bind(this);
    this.exam = JSON.parse(this.props.data[0].list);
    this.state = {
      index: 0, icon: 'arrow-right',
      text: '次へ', isModalOpen: false,
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
      input: input
    });
  }
  IncrementIndex() {
    // 終了ボタンを押したらlistに戻る
    if (this.state.index == this.exam.length - 1) {
      this.setState({ isModalOpen: true });
      return;
    }
    // 最後の問題であれば、ボタンの内容を変化させる
    if (this.state.index + 1 == this.exam.length - 1) {
      this.setState({ icon: 'check', text: '終了' });
    }
    // indexの変更
    this.SetIndex(this.state.index + 1);
  }
  DecrementIndex() {
    if (this.state.index == 0) return;
    // 最後の問題からひとつ前に戻る時、ボタンの内容をもとに戻す
    if (this.state.index == this.exam.length - 1) {
      this.setState({ icon: 'arrow-right', text: '次へ' });
    }
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

        <form>
          <label>解答</label>
          <input type='text' value={this.state.input}
            onChange={(e) => this.UpdateUsersResponse(e)}
          />
        </form>

        <div className={css.buttons}>
          {this.BackButton()}
          <Button info={{
            text: this.state.text, icon: 'fas fa-'+this.state.icon,
            onClick: () => this.IncrementIndex(), type: 'material'
          }} />
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