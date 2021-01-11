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
import Form from '../components/Form';
import Modal from '../components/Modal';
import Button from '../components/Button';
import ModalData from '../types/ModalData';

enum NextButtonState {
  show_answer,
  next_question,
  finish_exam
}

interface ExamState {
  checked: boolean,
  isCorrect: boolean
}

export default class list extends React.Component {
  private exam;
  constructor(props) {
    super(props);
    this.exam = JSON.parse(this.props.data[0].list);
    // 解答状況の初期化
    const length = this.exam.length;
    let tmp: ExamState[] = Array<ExamState>();
    for (let i = 0; i < length; i++){
      tmp[i] = { checked: false, isCorrect: false };
    }
    // stateの初期化
    this.state = {
      index: 0, isModalOpen: false, input: '',
      nextButtonState: NextButtonState.show_answer,
      responses: Array<string>(length),
      examState: tmp
    };
  }

  // 解答が合っているかどうか確認してstateに格納
  CheckAnswer() {
    const index = this.state.index;
    let result: ExamState = {checked: true, isCorrect: false};
    if (this.state.responses[index] == this.exam[index].answer) {
      result.isCorrect = true;
    }
    let tmp = this.state.examState;
    tmp[index] = result;
    this.setState({ examState: tmp });
  }

  // indexを増減する
  SetIndex(i: number) {
    // 入力欄を変更する
    let input = '';
    if (this.state.responses[i]) {
      input = this.state.responses[i];
    }

    let button_state = NextButtonState.show_answer
    // 解答済みの問題だった場合
    if (this.state.examState[i].checked) {
      // 最後の問題であれば終了ボタン
      if (i == this.exam.length - 1) {
        button_state = NextButtonState.finish_exam;
      } else {
        //そうでないなら次へボタン
        button_state = NextButtonState.next_question;
      }
    }
    this.setState({
      index: i,
      input: input,
      nextButtonState: button_state
    });
  }
  IncrementIndex() {
    switch (this.state.nextButtonState) {
      // 答えを表示、答え合わせをする
      case NextButtonState.show_answer:
        this.CheckAnswer();
        // 最後の問題であれば、ボタンを終了ボタンに
        if (this.state.index == this.exam.length - 1) {
          this.setState({ nextButtonState: NextButtonState.finish_exam });
        } else {
          //そうでないなら次へボタン
          this.setState({ nextButtonState: NextButtonState.next_question });
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
  }

  // 最初の要素だった場合はボタンを非表示に
  // 次へボタンを右に寄せて表示するため、divを返す
  BackButton() {
    if (this.state.index == 0) return(<div></div>);
    else return (
      <Button {...{
        text: '戻る', icon: 'fas fa-arrow-left',
        onClick: () => this.DecrementIndex(), type: 'material'
      }} />
    );
  }
  NextButton() {
    let text: string, icon: string;
    switch (this.state.nextButtonState) {
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
      <Button {...{
        text: text, icon: icon,
        onClick: () => this.IncrementIndex(), type: 'material'
      }} />
    );
  }

  // 正解状況の表示
  ShowExamState() {
    const state = this.state.examState[this.state.index];
    if (!state.checked) return;
    return (
      <div className={css.exam_state}>
        <div className={state.isCorrect ? 'far fa-circle' : 'fas fa-times'} />
        <p>{state.isCorrect ? '正解' : '不正解'}</p>
      </div>
    );
  }

  // 問題をとき終わったときに表示するウィンドウ
  FinishWindow() {
    return (
      <div className={css.window}>
        <h1>🎉問題終了🎉</h1>
        <p>お疲れさまでした。</p>
        <div className={css.window_buttons}>
        <Button {...{
          text: 'ウィンドウを閉じる', icon: 'fas fa-times',
          onClick: () => this.setState({isModalOpen: false}), type: 'material'
        }} />
        <Button {...{
          text: '問題一覧へ戻る', icon: 'fas fa-undo',
          onClick: () => Router.push('/list'), type: 'filled'
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
          {/* 問題文、解答欄 */}
          <div className={css.answer_area}>
            <p id={css.question}>問題: {this.exam[this.state.index].question}</p>

            <form className={css.form}>
              <Form info={{
                label: '解答', value: this.state.input, rows: 1,
                onChange: (e) => this.UpdateUsersResponse(e),
                disabled: this.state.examState[this.state.index].checked
              }}/>
              {/* 入力中エンターを押して送信を無効化 */}
              <input id={css.dummy} />
            </form>
          </div>

          {/* 結果 */}
          {this.ShowExamState()}
        </div>

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
  const res = await fetch('https://api.watasuke.tk?id=' + context.query.id);
  const data = await res.json();
  return {props:{data}};
}