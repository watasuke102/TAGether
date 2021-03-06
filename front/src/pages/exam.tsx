// TAGether - Share self-made exam for classmates
// exam.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/pages/exam.module.scss';
import React from 'react';
import Helmet from 'react-helmet';
import Router from 'next/router';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import Form from '../components/Form';
import Modal from '../components/Modal';
import Button from '../components/Button';
import ExamTable from '../components/ExamTableComponent';
import GetFromApi from '../ts/Api';
import { AddExamHistory, GetSpecifiedExamHistory } from '../ts/ManageDB';
import Exam from '../types/Exam';
import Categoly from '../types/Categoly';
import ExamState from '../types/ExamState';
import ExamHistory from '../types/ExamHistory';
import ButtonInfo from '../types/ButtonInfo';
import ButtonContainer from '../components/ButtonContainer';

enum NextButtonState {
  show_answer,
  next_question,
  finish_exam
}

interface Props {
  data: Categoly[],
  shuffle: boolean,
  id: number,
  history_id?: string
  tag_filter?: string
}
interface State {
  exam: Exam[],
  title: string,
  index: number,
  correct_rate: number
  isModalOpen: boolean,
  nextButtonState: NextButtonState,
  showExamStateTable: boolean
  // answers[index][問題番号]
  answers: string[][],
  examState: ExamState[],
  // 解答一覧で、正解を表示するかどうか
  showCorrectAnswer: boolean
}

export default class exam extends React.Component<Props, State> {
  private ref;
  private correct_answers = 0;
  private total_questions = 0;
  private exam_history: ExamHistory;

  constructor(props: Props) {
    super(props);

    let exam: Exam[] = [];
    let title = '';
    // 間違えた問題のやり直しであれば
    if (props.history_id) {
      this.InitWrongExamList();
    } else {
      // 通常カテゴリであれば
      title = this.props.data[0].title;
      exam = JSON.parse(this.props.data[0].list);
    }

    this.exam_history = {
      id: this.props.id,
      title: title,
      date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      correct_count: 0, total_question: 0,
      wrong_exam: []
    };
    this.ref = React.createRef();
    // Fisher-Yatesアルゴリズムで問題順シャッフル
    if (this.props.shuffle) {
      for (let i = exam.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        const tmp = exam[i];
        exam[i] = exam[r];
        exam[r] = tmp;
      }
    }
    // 解答状況の初期化
    const exam_length = exam.length;
    const exam_state: ExamState[] = Array<ExamState>();
    let max_answer = 1;
    for (let i = 0; i < exam_length; i++) {
      exam_state[i] = { order: 0, checked: false, correctAnswerCount: 0, realAnswerList: [] };
      if (exam[i].answer.length > max_answer) {
        max_answer = exam[i].answer.length;
      }
    }
    // 解答欄の初期化
    const answers: string[][] = Array<Array<string>>(exam_length);
    for (let i = 0; i < exam_length; i++) {
      answers[i] = Array<string>(max_answer).fill('');
    }
    // stateの初期化
    this.state = {
      exam: exam, title: title, index: 0, isModalOpen: false,
      correct_rate: 0, showExamStateTable: false,
      nextButtonState: NextButtonState.show_answer,
      answers: answers, examState: exam_state,
      showCorrectAnswer: false
    };
  }

  InitWrongExamList(): void {
    if (!process.browser) return;
    GetSpecifiedExamHistory(this.props.history_id ?? '').then((result) => {
      if (result) {
        // ここから下はコンストラクタとほぼ同じ処理をしてる //

        // Fisher-Yatesアルゴリズムで問題順シャッフル
        const exam = result.wrong_exam;
        if (this.props.shuffle) {
          for (let i = exam.length - 1; i > 0; i--) {
            const r = Math.floor(Math.random() * (i + 1));
            const tmp = exam[i];
            exam[i] = exam[r];
            exam[r] = tmp;
          }
        }
        // 解答状況の初期化
        const exam_length = result.wrong_exam.length;
        const exam_state: ExamState[] = Array<ExamState>();
        let max_answer = 1;
        for (let i = 0; i < exam_length; i++) {
          exam_state[i] = { order: 0, checked: false, correctAnswerCount: 0, realAnswerList: [] };
          if (exam[i].answer.length > max_answer) {
            max_answer = exam[i].answer.length;
          }
        }
        // 解答欄の初期化
        const answers: string[][] = Array<Array<string>>(exam_length);
        for (let i = 0; i < exam_length; i++) {
          answers[i] = Array<string>(max_answer).fill('');
        }

        // 同じ処理おわり //
        this.setState({
          exam: exam, title: `やり直し: ${result.title}`,
          answers: answers, examState: exam_state
        });
      }
    });
  }

  // ショートカットキー
  Shortcut(e: KeyboardEvent): void {
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
  componentDidMount(): void {
    window.addEventListener('keydown', e => this.Shortcut(e));
  }
  componentWillUnmount(): void {
    window.removeEventListener('keydown', e => this.Shortcut(e));
    // 間違えた問題のやり直しでない and タグ全部でもない and 最後まで解いた
    // この条件を満たしているとき結果を保存する
    if (this.props.history_id === undefined &&
      this.props.tag_filter === undefined &&
      this.state.examState.slice(-1)[0].checked
    ) {
      this.exam_history.total_question = this.total_questions;
      this.exam_history.correct_count = this.correct_answers;
      AddExamHistory(this.exam_history);
    }
  }

  componentDidUpdate(): void {
    // 結果表示、もしくは間違えた問題の読み込みが終了していなければ終了
    if (
      this.state.showExamStateTable ||
      (this.props.history_id && this.state.exam.length === 0)
    ) return;
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
  CheckAnswer(): void {
    const index = this.state.index;
    const result: ExamState = { order: 0, checked: true, correctAnswerCount: 0, realAnswerList: [] };
    let correct: boolean = false;
    this.state.exam[index].answer.forEach((e, i) => {
      correct = false;
      // '&'で区切る（AもしくはBみたいな数種類の正解を用意できる）
      e.split('&').map(ans => {
        // 合ってたら正解数と全体の正解数をインクリメント
        if (this.state.answers[index][i] == ans && !correct) {
          correct = true;
          result.correctAnswerCount++;
          this.correct_answers++;
        }
      });
      // 正しい解答をリストに追加
      const classname = (correct) ? '' : css.wrong;
      if (this.state.exam[index].answer.length == 1) {
        result.realAnswerList.push(<p className={classname}>{e}</p>);
      } else {
        result.realAnswerList.push(<p className={classname}>{i + 1}問目: {e}</p>);
      }
      this.total_questions++;
    });

    // 全問正解
    if (result.correctAnswerCount == this.state.exam[index].answer.length) {
      result.order = 0;
    } else {
      // 1問でも間違っていたら、間違えた問題リストに追加
      this.exam_history.wrong_exam.push(this.state.exam[index]);
      // 全問不正解の場合
      if (result.correctAnswerCount == 0) {
        result.order = 2;
      } else {
        // 部分正解
        result.order = 1;
      }
    }
    const tmp = this.state.examState;
    tmp[index] = result;
    this.setState({ examState: tmp });
  }

  // indexを増減する
  SetIndex(i: number): void {
    let button_state = NextButtonState.show_answer;
    // 解答済みの問題だった場合
    if (this.state.examState[i].checked) {
      // 最後の問題であれば終了ボタン
      if (i == this.state.exam.length - 1) {
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
  IncrementIndex(): void {
    switch (this.state.nextButtonState) {
      // 答えを表示、答え合わせをする
      case NextButtonState.show_answer:
        this.CheckAnswer();
        // 最後の問題であれば、ボタンを終了ボタンに
        if (this.state.index == this.state.exam.length - 1) {
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
        this.setState({
          isModalOpen: true,
          correct_rate: Math.round((this.correct_answers / this.total_questions) * 10000) / 100
        });
        break;
    }
  }
  DecrementIndex(): void {
    if (this.state.index == 0) return;
    // indexの変更
    this.SetIndex(this.state.index - 1);
  }

  // ユーザーの入力（問題への解答）を配列に入れる
  UpdateUsersResponse(event: React.ChangeEvent<HTMLTextAreaElement>, i: number): void {
    const tmp = this.state.answers;
    tmp[this.state.index][i] = event.target.value;
    this.setState({ answers: tmp });
  }


  //解答欄
  AnswerArea(): React.ReactElement[] {
    const length = this.state.exam[this.state.index].answer.length;
    const obj: React.ReactElement[] = [];
    let label = '';
    for (let i = 0; i < length; i++) {
      const tmp = this.state.answers[this.state.index][i];
      // 入力欄のラベル
      label = '解答' + ((length == 1) ? '' : '(' + (i + 1) + ')');
      obj.push(
        <div className={css.form}> <Form {...{
          label: label, value: tmp, rows: 1, ref: (i == 0) ? this.ref : null,
          onChange: ev => this.UpdateUsersResponse(ev, i),
          disabled: this.state.examState[this.state.index].checked
        }} /> </div>
      );
    }
    return obj;
  }

  // 最初の要素だった場合はボタンを非表示に
  // 次へボタンを右に寄せて表示するため、divを返す
  BackButton(): React.ReactElement {
    if (this.state.index == 0) return (<div></div>);
    else return (
      <Button {...{
        text: '戻る', icon: 'fas fa-arrow-left',
        onClick: () => this.DecrementIndex(), type: 'material'
      }} />
    );
  }
  NextButton(): React.ReactElement {
    const info: ButtonInfo = {
      icon: '', text: '',
      type: 'material', onClick: () => this.IncrementIndex()
    };
    switch (this.state.nextButtonState) {
      case NextButtonState.show_answer:
        info.text = '答え合わせ'; info.icon = 'far fa-circle';
        break;
      case NextButtonState.next_question:
        info.text = '次へ'; info.icon = 'fas fa-arrow-right';
        break;
      case NextButtonState.finish_exam:
        info.text = '終了'; info.icon = 'fas fa-check'; info.type = 'filled';
        break;
    }
    return (
      <Button {...info} />
    );
  }

  // 正解状況の表示
  ShowExamState(): React.ReactElement | undefined {
    const state: ExamState = this.state.examState[this.state.index];
    if (!state.checked) return;

    const answer_length = this.state.exam[this.state.index].answer.length;
    let icon = 'fas fa-times';
    let result: string;
    // 問題数がひとつだった場合は「正解 or 不正解」
    if (answer_length == 1) {
      // 正解だった場合
      if (state.correctAnswerCount == 1) {
        icon = 'far fa-circle';
        result = '正解';
      } else {
        // 不正解だった場合
        result = '不正解';
      }
    } else {
      // 問題が2つ以上だった場合は「n問正解」
      // 全問正解で○アイコン
      if (state.correctAnswerCount == answer_length) {
        icon = 'far fa-circle';
      }
      result = state.correctAnswerCount + '問正解';
    }
    return (
      <div className={css.state_and_answer}>
        <div className={css.exam_state}>
          <div className={icon} />
          <p>{result}</p>
        </div>
        <div className={css.answer_list}>
          <p id={css.seikai}>正解:</p>
          {this.state.examState[this.state.index].realAnswerList}
        </div>
      </div>
    );
  }

  render(): React.ReactElement {
    // 解答状況一覧を表示する
    if (this.state.showExamStateTable) {
      const list: React.ReactElement[] = [];
      let answers: string = '';
      this.state.exam.forEach(e => {
        answers = '';
        e.answer.forEach(e => answers += e + ', ');
        list.push(
          <tr>
            <td>{
              e.question.split('\n').map(str => {
                return (<> {str}<br /> </>);
              })
            }</td>
            <td>{answers.slice(0, -2)}</td>
            <td></td>
          </tr>
        );
      });

      return (
        <>
          <div className={css.examdata_container}>
            <h2>{this.state.title}</h2>
            <div className={css.correct_rate_statuslist}>
              <p>
                {this.total_questions}問中{this.correct_answers}問正解、
                正答率{this.state.correct_rate}%
              </p>
            </div>
          </div>

          <ExamTable {...{
            exam: this.state.exam, answers: this.state.answers,
            examState: this.state.examState,
            showCorrectAnswer: this.state.showCorrectAnswer
          }} />
          <div className={css.button_container}>
            <div className={css.buttons}>
              <Button {...{
                text: 'もう一度', icon: 'fas fa-undo',
                onClick: Router.reload, type: 'material'
              }} />
              {/* 正しい答えの表示/非表示切り替え */}
              <Button {...{
                onClick: () => this.setState(state => {
                  return { showCorrectAnswer: !state.showCorrectAnswer };
                }),
                type: 'material',
                text: this.state.showCorrectAnswer ? '正解を非表示' : '正解を表示',
                icon: this.state.showCorrectAnswer ? 'fas fa-eye-slash' : 'fas fa-eye',
              }} />
              <Button {...{
                text: '前のページへ', icon: 'fas fa-arrow-left',
                onClick: Router.back, type: 'filled'
              }} />
            </div>
          </div>
        </>
      );
    }

    // 読み込みが終わっていなかった場合
    if (this.state.exam.length === 0 && this.props.history_id) {
      return (<p>読み込み中...</p>);
    }

    const current_status = `${this.state.index + 1}/${this.state.exam.length}`;

    return (
      <>
        <Helmet title={`(${current_status}) : ${this.state.title} - TAGether`} />

        <h1>{current_status}</h1>

        <div className={css.display}>
          {/* 問題文、解答欄 */}
          <div className={css.exam}>
            <div className={css.question_area}>
              <div><h2 id={css.mondai}>問題</h2></div>
              <div className={css.question_text}><p>{
                this.state.exam[this.state.index].question.split('\n').map(str => {
                  return (<> {str}<br /> </>);
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

        <Modal isOpen={this.state.isModalOpen} close={() => this.setState({ isModalOpen: false })}>
          <div className={css.window}>
            <h1>🎉問題終了🎉</h1>
            <p>お疲れさまでした。</p>
            <p className={css.correct_rate}>
              <b>正答率{this.state.correct_rate}%</b><br />
              （{this.total_questions}問中{this.correct_answers}問正解）
            </p>
            <ButtonContainer>
              {(!this.props.history_id && !this.props.tag_filter) ?
                <Button {...{
                  text: '編集する', icon: 'fas fa-pen', type: 'material',
                  onClick: () => Router.push('/edit?id=' + this.props.id),
                }} /> : <></>
              }
              <Button {...{
                text: '回答状況一覧', icon: 'fas fa-list', type: 'material',
                onClick: () => this.setState({ isModalOpen: false, showExamStateTable: true }),
              }} />
              <Button {...{
                text: '前のページへ', icon: 'fas fa-arrow-left', type: 'filled',
                onClick: Router.back,
              }} />
            </ButtonContainer>
          </div>
        </Modal>

      </>
    );
  }
}

// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async (context) => {
  // 解答履歴からのやり直し
  if (context.query.history_id != undefined) {
    return {
      props: {
        data: [], id: -1,
        shuffle: (context.query.shuffle === 'true'),
        history_id: context.query.history_id
      }
    };
  }
  const data = await GetFromApi<Categoly>('categoly', context.query.id);
  const props: Props = {
    data: data,
    shuffle: (context.query.shuffle === 'true'),
    id: (context.query.id == undefined) ? -1 : Number(context.query.id)
  };
  // 特定のタグを解くのであれば
  if (context.query.tag) {
    let filter: string = '';
    if (Array.isArray(context.query.tag))
      filter = context.query.tag[0];
    else filter = context.query.tag;
    props.tag_filter = filter;

    const data: Categoly = {
      title: `タグ (${filter})`, description: '', tag: [], list: '[]'
    };

    props.data.forEach(e => {
      let tag_included = false;
      // タグが含まれているかどうかをチェック
      e.tag.forEach(tag => {
        if (tag_included) return;
        tag_included = (tag.name === filter);
        console.log(tag_included && e.title);
      });
      // タグが含まれているカテゴリであれば、問題を追加
      if (tag_included) {
        const data_list = JSON.parse(data.list);
        const elem_list = JSON.parse(e.list);
        data.list = JSON.stringify(data_list.concat(elem_list));
      }
    });

    props.data = [data];

  }
  console.log(JSON.parse(props.data[0].list));
  return { props: props };
};
