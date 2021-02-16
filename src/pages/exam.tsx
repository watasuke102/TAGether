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
import ExamTable from '../components/ExamTableComponent';
import Exam from '../types/Exam';
import Categoly from '../types/Categoly';
import ExamState from '../types/ExamState';
import ModalData from '../types/ModalData';

enum NextButtonState {
  show_answer,
  next_question,
  finish_exam
}

interface Props {
  data: Categoly[],
  shuffle: boolean,
  id: number
}
interface State {
  index:              number,
  isModalOpen:        boolean,
  nextButtonState:    NextButtonState,
  showExamStateTable: boolean
  // answers[index][問題番号]
  answers:            string[][],
  examState:          ExamState[],
}

export default class exam extends React.Component<Props, State> {
  private exam: Exam[];
  private ref;
  private correct_answers = 0;
  private total_questions = 0;

  constructor(props: Props) {
    super(props);
    this.ref = React.createRef();
    // 問題の取得、条件によってはシャッフル
    this.exam = JSON.parse(this.props.data[0].list);
    // Fisher-Yatesアルゴリズムらしい
    if (this.props.shuffle) {
      for(let i = this.exam.length-1; i > 0; i--){
        var r = Math.floor(Math.random() * (i + 1));
        var tmp = this.exam[i];
        this.exam[i] = this.exam[r];
        this.exam[r] = tmp;
      }
    }
    // 解答状況の初期化
    const exam_length = this.exam.length;
    let exam_state: ExamState[] = Array<ExamState>();
    let max_answer = 1;
    for (let i = 0; i < exam_length; i++) {
      exam_state[i] = { order: 0, checked: false, correctAnswerCount: 0, realAnswerList: [] };
      if (this.exam[i].answer.length > max_answer) {
        max_answer = this.exam[i].answer.length;
      }
    }
    // 解答欄の初期化
    let answers: string[][] = Array<Array<string>>(exam_length);
    for (let i = 0; i < exam_length; i++) {
      answers[i] = Array<string>(max_answer).fill('');
    }
    // stateの初期化
    this.state = {
      index: 0, isModalOpen: false, showExamStateTable: false,
      nextButtonState: NextButtonState.show_answer,
      answers: answers,
      examState: exam_state
    };
  }

  // ショートカットキー
  Shortcut(e) {
    // Ctrl+Shift+矢印キー等で動かす
    // キーリピートでの入力とウィンドウが表示されている場合は無効
    if (e.ctrlKey && e.shiftKey && !e.repeat && !this.state.isModalOpen) {
      if (e.code == 'KeyH' || e.code == 'ArrowLeft') {
        this.DecrementIndex();
      }
      else if (e.code == 'KeyL' || e.code == 'ArrowRight') {
        this.IncrementIndex();
      }
    }
  }
  componentDidMount() {
    window.addEventListener('keydown', e=>this.Shortcut(e));
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', e=>this.Shortcut(e));
  }

  componentDidUpdate() {
    if (this.state.showExamStateTable) return;
    let b: boolean = false;
    this.state.answers[this.state.index].map(e => {
      if (e != '') {
        b = true;
        return;
      }
    });
    if (b) return;
    // 入力欄にフォーカスする
    this.ref.current.focus();
  }

  // 解答が合っているかどうか確認してstateに格納
  CheckAnswer() {
    const index = this.state.index;
    let result: ExamState = { order: 0, checked: true, correctAnswerCount: 0, realAnswerList: [] };
    let correct: boolean = false;
    this.exam[index].answer.forEach((e, i) => {
      correct = false;
      // '&'で区切る（AもしくはBみたいな数種類の正解を用意できる）
      e.split('&').map(ans => {
        // 合ってたら正解数と全体の正解数をインクリメント
        if (this.state.answers[index][i] == ans && !correct) {
          correct = true;
          result.correctAnswerCount++;
          this.correct_answers++;
        }
      })
      // 正しい解答をリストに追加
      const classname = (correct) ? '' : css.wrong;
      if (this.exam[index].answer.length == 1) {
        result.realAnswerList.push(<p className={classname}>{e}</p>);
      } else {
        result.realAnswerList.push(<p className={classname}>{i+1}問目: {e}</p>);
      }
      this.total_questions++;
    });

    // 全問不正解の場合
    if (result.correctAnswerCount == 0) {
      result.order = 2;
    } else if (result.correctAnswerCount == this.exam[index].answer.length) {
      // 全問正解
      result.order = 0;
    } else {
      // 部分正解
      result.order = 1
    }
    let tmp = this.state.examState;
    tmp[index] = result;
    this.setState({ examState: tmp });
  }

  // indexを増減する
  SetIndex(i: number) {
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
  UpdateUsersResponse(event, i: number) {
    let tmp = this.state.answers;
    tmp[this.state.index][i] = event.target.value;
    this.setState({ answers: tmp});
  }


  //解答欄
  AnswerArea() {
    const length = this.exam[this.state.index].answer.length;
    let obj: object[] = [];
    let label = '';
    for (let i = 0; i < length; i++) {
      let tmp = this.state.answers[this.state.index][i];
      // 入力欄のラベル
      label = '解答' + ( (length == 1)? '' : '('+(i+1)+')' );
      obj.push(
        <div className={css.form}> <Form {...{
          label: label, value: tmp, rows: 1, ref: (i==0)? this.ref : null,
          onChange: (ev) => this.UpdateUsersResponse(ev, i),
          disabled: this.state.examState[this.state.index].checked
          }} /> </div>
      );
    }
    return obj;
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
    let text: string, icon: string, type='material'
    switch (this.state.nextButtonState) {
      case NextButtonState.show_answer:
        text = '答え合わせ'; icon = 'far fa-circle';
        break;
      case NextButtonState.next_question:
        text = '次へ'; icon = 'fas fa-arrow-right';
        break;
      case NextButtonState.finish_exam:
        text = '終了'; icon = 'fas fa-check'; type = 'filled';
        break;
    }
    return (
      <Button {...{
        text: text, icon: icon,
        onClick: () => this.IncrementIndex(), type: type
      }} />
    );
  }

  // 正解状況の表示
  ShowExamState() {
    let state: ExamState = this.state.examState[this.state.index];
    if (!state.checked) return;

    const answer_length = this.exam[this.state.index].answer.length;
    let icon = 'fas fa-times';
    let result: string;
    // 問題数がひとつだった場合は「正解 or 不正解」
    if (answer_length == 1) {
      // 正解だった場合
      if (state.correctAnswerCount == 1) {
        icon = 'far fa-circle';
        result = '正解'
      } else {
        // 不正解だった場合
        result = '不正解'
      }
    } else {
      // 問題が2つ以上だった場合は「n問正解」
      // 全問正解で○アイコン
      if (state.correctAnswerCount == answer_length) {
        icon = 'far fa-circle';
      }
      result = state.correctAnswerCount + '問正解'
    }
    return (
      <div className={css.state_and_answer}>
        <div className={css.exam_state}>
          <div className={icon}/>
          <p>{result}</p>
        </div>
        <div className={css.answer_list}>
          <p id={css.seikai}>正解:</p>
          {this.state.examState[this.state.index].realAnswerList}
        </div>
      </div>
    );
  }

  // 問題をとき終わったときに表示するウィンドウ
  FinishWindow() {
    const correct_rate = Math.round((this.correct_answers / this.total_questions)*10000)/100;
    return (
      <div className={css.window}>
        <h1>🎉問題終了🎉</h1>
        <p>お疲れさまでした。</p>
        <p className={css.correct_rate}>
          <b>正答率{correct_rate}%</b><br />
          （{this.total_questions}問中{this.correct_answers}問正解）
        </p>
        <div className={css.window_buttons}>
        <Button {...{
          text: '編集する', icon: 'fas fa-pen', type: 'material',
          onClick: () => Router.push('/edit?id='+this.props.id), 
        }} />
        <Button {...{
          text: '回答状況一覧', icon: 'fas fa-list', type: 'material',
          onClick: () => this.setState({isModalOpen: false, showExamStateTable: true}),
        }} />
        <Button {...{
          text: 'カテゴリ一覧へ', icon: 'fas fa-undo', type: 'filled',
          onClick: () => Router.push('/list'),
        }} />
        </div>
      </div>
    );
  }


  render() {
    // Modalに渡す用のデータ
    const modalData: ModalData = {
      body: this.FinishWindow(),
      isOpen: this.state.isModalOpen,
      close: () => this.setState({isModalOpen: false}),
    };

    if (this.state.showExamStateTable) {
      let list: Object[] = [];
      let answers: string = '';
      this.exam.forEach(e => {
        answers = '';
        e.answer.forEach(e => answers += e+', ');
        list.push(
          <tr>
            <td>{
              e.question.split('\n').map(str => {
                return (<> {str}<br /> </>)
              })
            }</td>
            <td>{answers.slice(0, -2)}</td>
            <td></td>
          </tr>
        )
      });
      return(
        <>
          <ExamTable {...{
            exam: this.exam, answers: this.state.answers,
            examState: this.state.examState
          }} />
          <div className={css.button_container}>
            <div className={css.buttons}>
              <Button {...{
                text: 'もう一度', icon: 'fas fa-undo',
                onClick: Router.reload, type: 'material'
              }} />
              <Button {...{
                text: 'カテゴリ一覧へ', icon: 'fas fa-arrow-left',
                onClick: () => Router.push('/list'), type: 'filled'
              }} />
            </div>
          </div>
        </>
      );
    }
    
    return (
      <>
        <h1>{this.state.index+1}/{this.exam.length}</h1>

        <div className={css.display}>
          {/* 問題文、解答欄 */}
          <div className={css.exam}>
            <div className={css.question_area}>
              <div><h2 id={css.mondai}>問題</h2></div>
              <div className={css.question_text}><p>{
                this.exam[this.state.index].question.split('\n').map(str => {
                  return (<> {str}<br/> </>)
                })
              }</p></div>
            </div>

            <form>
              {this.AnswerArea()}
              {/* 入力中エンターを押して送信を無効化 */}
              <input id={css.dummy} />
            </form>
          </div>

          {/* 結果 */}
          {this.ShowExamState()}
        </div>

        <div className={css.button_container}>
          <div className={css.buttons}>
            {this.BackButton()}
            {this.NextButton()}
          </div>
        </div>

        <Modal {...modalData} />
 
      </>
    );
  }
}

// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = (context.query.id == undefined)? -1 : Number(context.query.id)
  const res = await fetch(process.env.API_URL + '?id=' + id);
  const data = await res.json();
  const props: Props = {
    data: data,
    shuffle: (context.query.shuffle == 'true') ? true : false,
    id: id
  };
  return {props: props};
}
