// TAGether - Share self-made exam for classmates
// exam.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './exam.module.scss';
import {format} from 'date-fns';
import Router from 'next/router';
import React from 'react';
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';
import Helmet from 'react-helmet';
import Button from '@/common/Button/Button';
import ButtonContainer from '@/common/Button/ButtonContainer';
import CheckBox from '@/common/CheckBox/CheckBox';
import Modal from '@/common/Modal/Modal';
import Form from '@/common/TextForm/Form';
import ExamTable from '@/features/ExamTable/ExamTableComponent';
import {AddExamHistory} from '@/utils/ManageDB';
import ButtonInfo from '@mytypes/ButtonInfo';
import Categoly from '@mytypes/Categoly';
import Exam from '@mytypes/Exam';
import ExamHistory from '@mytypes/ExamHistory';
import ExamState from '@mytypes/ExamState';
import ParseAnswers from '../../ParseAnswer';

enum NextButtonState {
  show_answer,
  next_question,
  finish_exam,
}

interface Props {
  data: Categoly;
  history_id: string | string[] | undefined;
  tag_filter: string | string[] | undefined;
}

interface State {
  exam: Exam[];
  title: string;
  index: number;
  correct_rate: number;
  isModalOpen: boolean;
  nextButtonState: NextButtonState;
  showExamStateTable: boolean;
  // answers[index][問題番号]
  answers: string[][];
  examState: ExamState[];
  // 解答一覧で、正解を表示するかどうか
  showCorrectAnswer: boolean;
}

export default class exam extends React.Component<Props, State> {
  private ref: React.RefObject<HTMLTextAreaElement>;
  private correct_answers = 0;
  private total_questions = 0;
  private version = 2;
  private exam_history: ExamHistory;

  constructor(props: Props) {
    super(props);

    let exam_list: Exam[] = [];
    const title = this.props.data.title;
    exam_list = JSON.parse(this.props.data.list);
    this.version = this.props.data.version;

    this.exam_history = {
      id: this.props.data.id ?? 0,
      title: title,
      date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      correct_count: 0,
      total_question: 0,
      wrong_exam: [],
    };
    this.ref = React.createRef<HTMLTextAreaElement>();
    // 解答状況・解答欄の初期化
    const exam_length = exam_list.length;
    const exam_state: ExamState[] = Array<ExamState>();
    const answers: string[][] = Array<Array<string>>(exam_length);
    for (let i = 0; i < exam_length; i++) {
      exam_state[i] = {order: 0, checked: false, correctAnswerCount: 0};
      answers[i] = Array<string>(exam_list[i].answer.length).fill('');
    }
    // 最初が並び替えならコピー+シャッフル
    if (exam_list[0].type === 'Sort' && this.version === 2) {
      // 参照コピーはだめなので、引数なしconcatで新規配列作成
      answers[0] = exam_list[0].answer.concat();
      for (let i = answers[0].length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        const tmp = answers[0][i];
        answers[0][i] = answers[0][r];
        answers[0][r] = tmp;
      }
    }
    // stateの初期化
    this.state = {
      exam: exam_list,
      title: title,
      index: 0,
      isModalOpen: false,
      correct_rate: 0,
      showExamStateTable: false,
      nextButtonState: NextButtonState.show_answer,
      answers: answers,
      examState: exam_state,
      showCorrectAnswer: false,
    };
  }

  // ショートカットキー
  Shortcut(e: KeyboardEvent): void {
    // Ctrl+Shift+矢印キー等で動かす
    // キーリピートでの入力とウィンドウが表示されている場合は無効
    if (e.ctrlKey && e.shiftKey && !e.repeat && !this.state.isModalOpen) {
      if (e.code === 'KeyH' || e.code === 'ArrowLeft') {
        this.DecrementIndex();
      } else if (e.code === 'KeyL' || e.code === 'ArrowRight') {
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
    if (
      this.props.history_id === undefined &&
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
    if (this.state.showExamStateTable || (this.props.history_id && this.state.exam.length === 0)) return;
    // ページ更新時、全ての入力欄が空欄であれば入力欄にフォーカス
    for (let i = 0; i < this.state.answers[this.state.index].length; i++)
      if (this.state.answers[this.state.index][i] !== '') return;
    this.ref.current?.focus();
  }

  // 解答が合っているかどうか確認してstateに格納
  CheckAnswer(): void {
    const index = this.state.index;
    const result: ExamState = {order: 0, checked: true, correctAnswerCount: 0};
    const exam = this.state.exam[index];
    let correct: boolean = false;

    // 複数選択問題は、完全一致のみ正解にする
    if (exam.type === 'MultiSelect' && this.version === 2) {
      // ソートして比較する
      const my_answers = this.state.answers[index]
        .filter(e => e !== '')
        .sort()
        .toString();
      const real_answers = exam.answer.sort().toString();
      if (my_answers === real_answers) {
        result.correctAnswerCount++;
        this.correct_answers++;
      }
      this.total_questions++;
    } else {
      exam.answer.forEach((e, i) => {
        correct = false;
        // '&'で区切る（AもしくはBみたいな数種類の正解を用意できる）
        e.split('&').map(ans => {
          if (this.state.answers[index][i] === ans && !correct) {
            // 合ってたら正解数と全体の正解数をインクリメント
            correct = true;
            result.correctAnswerCount++;
            this.correct_answers++;
          }
        });
        this.total_questions++;
      });
    }

    // 全問正解
    if (result.correctAnswerCount === this.state.exam[index].answer.length) {
      result.order = 0;
    } else {
      // 1問でも間違っていたら、間違えた問題リストに追加
      this.exam_history.wrong_exam.push(this.state.exam[index]);
      // 全問不正解の場合
      if (result.correctAnswerCount === 0) {
        result.order = 2;
      } else {
        // 部分正解
        result.order = 1;
      }
    }
    const tmp = this.state.examState;
    tmp[index] = result;
    this.setState({examState: tmp});
  }

  // indexを増減する
  SetIndex(i: number): void {
    let button_state = NextButtonState.show_answer;
    // 解答済みの問題だった場合
    if (this.state.examState[i].checked) {
      // 最後の問題であれば終了ボタン
      if (i === this.state.exam.length - 1) {
        button_state = NextButtonState.finish_exam;
      } else {
        //そうでないなら次へボタン
        button_state = NextButtonState.next_question;
      }
    }
    this.setState({
      index: i,
      nextButtonState: button_state,
    });
  }
  IncrementIndex(): void {
    switch (this.state.nextButtonState) {
      // 答えを表示、答え合わせをする
      case NextButtonState.show_answer:
        this.CheckAnswer();
        // 最後の問題であれば、ボタンを終了ボタンに
        if (this.state.index === this.state.exam.length - 1) {
          this.setState({nextButtonState: NextButtonState.finish_exam});
        } else {
          //そうでないなら次へボタン
          this.setState({nextButtonState: NextButtonState.next_question});
        }
        break;

      // 次の問題へ進む
      case NextButtonState.next_question:
        const next_index = this.state.index + 1;
        // indexの変更
        this.SetIndex(next_index);

        // 次が並び替え問題なら、exam.answerをstate.answersにコピーしてシャッフル
        if (this.state.exam[next_index].type === 'Sort' && this.version === 2) {
          // 参照コピーはだめなので、引数なしconcatで新規配列作成
          const answers = this.state.answers.concat();
          answers[next_index] = this.state.exam[next_index].answer.concat();
          for (let i = answers[next_index].length - 1; i > 0; i--) {
            const r = Math.floor(Math.random() * (i + 1));
            const tmp = answers[next_index][i];
            answers[next_index][i] = answers[next_index][r];
            answers[next_index][r] = tmp;
          }
          this.setState({answers: answers});
        }
        break;

      // 終了ボタンを押したらモーダルウィンドウを表示
      case NextButtonState.finish_exam:
        this.setState({
          isModalOpen: true,
          correct_rate: Math.round((this.correct_answers / this.total_questions) * 10000) / 100,
        });
        break;
    }
  }
  DecrementIndex(): void {
    if (this.state.index === 0) return;
    // indexの変更
    this.SetIndex(this.state.index - 1);
  }

  // ユーザーの入力（問題への解答）を配列に入れる
  UpdateUsersResponse(event: React.ChangeEvent<HTMLTextAreaElement>, i: number): void {
    const tmp = this.state.answers;
    tmp[this.state.index][i] = event.target.value;
    this.setState({answers: tmp});
  }

  //解答欄
  AnswerArea(): React.ReactElement | React.ReactElement[] {
    const exam = this.state.exam[this.state.index];
    // バージョン1であれば強制的にText扱いとする
    const type = this.version === 1 ? 'Text' : exam.type ?? 'Text';

    switch (type) {
      case 'Text':
        return exam.answer.map((e, i) => (
          <div className={css.form} key={`examform_Text_${i}`}>
            <Form
              rows={1}
              reff={i === 0 ? this.ref : null}
              label={`解答 ${exam.answer.length === 1 ? '' : `(${i + 1})`}`}
              value={this.state.answers[this.state.index][i]}
              onChange={ev => this.UpdateUsersResponse(ev, i)}
              disabled={this.state.examState[this.state.index].checked}
            />
          </div>
        ));

      case 'Select':
        return (
          exam.question_choices?.map((e, i) => (
            <CheckBox
              key={`examform_checkbox_${i}`}
              desc={e}
              status={
                Number(this.state.answers[this.state.index][0]) === i && this.state.answers[this.state.index][0] !== ''
              }
              onChange={f => {
                if (!f || this.state.examState[this.state.index].checked) return;
                const tmp = this.state.answers;
                tmp[this.state.index][0] = String(i);
                this.setState({answers: tmp});
              }}
            />
          )) ?? <>invalid</>
        );

      case 'MultiSelect':
        return (
          exam.question_choices?.map((e, i) => (
            <CheckBox
              key={`examform_checkbox_${i}`}
              desc={e}
              status={this.state.answers[this.state.index].indexOf(String(i)) !== -1}
              onChange={f => {
                if (this.state.examState[this.state.index].checked) return;
                const tmp = this.state.answers;
                if (f) tmp[this.state.index].push(String(i));
                else tmp[this.state.index] = tmp[this.state.index].filter(e => e !== String(i));
                this.setState({answers: tmp});
              }}
            />
          )) ?? <>invalid</>
        );

      case 'Sort':
        return (
          <DragDropContext
            onDragEnd={(e: DropResult) => {
              if (!e.destination) return;
              const from = e.source.index,
                to = e.destination.index;
              if (from === to) return;
              const ans = this.state.answers;
              ans[this.state.index].splice(to + (from < to ? 1 : 0), 0, ans[this.state.index][from]);
              ans[this.state.index].splice(from + (from > to ? 1 : 0), 1);
              this.setState({answers: ans});
            }}
          >
            <Droppable droppableId='examform_sort_item_droppable'>
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {this.state.answers[this.state.index].map((e, i) => {
                    const id = `exam-item-${i}`;
                    return (
                      <Draggable
                        key={id}
                        draggableId={id}
                        index={i}
                        isDragDisabled={this.state.examState[this.state.index].checked}
                      >
                        {provided => (
                          <div className={css.examform_sort_item} ref={provided.innerRef} {...provided.draggableProps}>
                            <span>{e}</span>
                            <span className={`fas fa-list ${css.icon}`} {...provided.dragHandleProps} />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        );
    } // switch(exam.type)
  }

  NextButton(): React.ReactElement {
    const info: ButtonInfo = {
      icon: '',
      text: '',
      type: 'material',
      onClick: () => this.IncrementIndex(),
    };
    switch (this.state.nextButtonState) {
      case NextButtonState.show_answer:
        info.text = '答え合わせ';
        info.icon = 'far fa-circle';
        break;
      case NextButtonState.next_question:
        info.text = '次へ';
        info.icon = 'fas fa-arrow-right';
        break;
      case NextButtonState.finish_exam:
        info.text = '終了';
        info.icon = 'fas fa-check';
        info.type = 'filled';
        break;
    }
    return <Button {...info} />;
  }

  // 正解状況の表示
  ShowExamState(): React.ReactElement | undefined {
    const state: ExamState = this.state.examState[this.state.index];
    if (!state.checked) return;

    const answer_length = this.state.exam[this.state.index].answer.length;
    let icon = 'fas fa-times';
    let result: string;
    // 問題数がひとつだった場合は「正解 or 不正解」
    if (answer_length === 1 || (this.state.exam[this.state.index].type === 'MultiSelect' && this.version === 2)) {
      // 正解だった場合
      if (state.correctAnswerCount === 1) {
        icon = 'far fa-circle';
        result = '正解';
      } else {
        // 不正解だった場合
        result = '不正解';
      }
    } else {
      // 問題が2つ以上だった場合は「n問正解」
      // 全問正解で○アイコン
      if (state.correctAnswerCount === answer_length) {
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
          {ParseAnswers(this.state.exam[this.state.index].answer, this.state.exam[this.state.index])}
          {this.state.exam[this.state.index].comment && (
            <div>
              <h2>コメント</h2>
              <p>{this.state.exam[this.state.index].comment}</p>
            </div>
          )}
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
        e.answer.forEach(e => (answers += e + ', '));
        list.push(
          <tr>
            <td>
              {e.question.split('\n').map(str => {
                return (
                  <>
                    {' '}
                    {str}
                    <br />{' '}
                  </>
                );
              })}
            </td>
            <td>{answers.slice(0, -2)}</td>
            <td></td>
          </tr>,
        );
      });

      return (
        <>
          <div className={css.examdata_container}>
            <h2>{this.state.title}</h2>
            <div className={css.correct_rate_statuslist}>
              <p>
                {this.total_questions}問中{this.correct_answers}問正解、 正答率{this.state.correct_rate}%
              </p>
            </div>
          </div>

          <ExamTable
            {...{
              exam: this.state.exam,
              answers: this.state.answers,
              examState: this.state.examState,
              showCorrectAnswer: this.state.showCorrectAnswer,
            }}
          />
          <div className={css.button_container}>
            <div className={css.buttons}>
              <Button
                {...{
                  text: 'もう一度',
                  icon: 'fas fa-undo',
                  onClick: Router.reload,
                  type: 'material',
                }}
              />
              {/* 正しい答えの表示/非表示切り替え */}
              <Button
                {...{
                  onClick: () =>
                    this.setState(state => {
                      return {showCorrectAnswer: !state.showCorrectAnswer};
                    }),
                  type: 'material',
                  text: this.state.showCorrectAnswer ? '正解を非表示' : '正解を表示',
                  icon: this.state.showCorrectAnswer ? 'fas fa-eye-slash' : 'fas fa-eye',
                }}
              />
              <Button
                {...{
                  text: '前のページへ',
                  icon: 'fas fa-arrow-left',
                  onClick: Router.back,
                  type: 'filled',
                }}
              />
            </div>
          </div>
        </>
      );
    }

    // 読み込みが終わっていなかった場合
    if (this.state.exam.length === 0 && this.props.history_id) {
      return <p>読み込み中...</p>;
    }

    const current_status = `${this.state.index + 1} / ${this.state.exam.length}`;
    return (
      <>
        <Helmet title={`(${current_status}) : ${this.state.title} - TAGether`} />

        <h1>{current_status}</h1>

        <div className={css.display}>
          {/* 問題文、解答欄 */}
          <div className={css.exam}>
            <div className={css.question_area}>
              <div>
                <h2 id={css.mondai}>問題</h2>
              </div>
              <div className={css.question_text}>
                <p>
                  {this.state.exam[this.state.index].question.split('\n').map(str => {
                    return (
                      <>
                        {' '}
                        {str}
                        <br />{' '}
                      </>
                    );
                  })}
                </p>
              </div>
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
            {this.state.index === 0 ? (
              // 次へボタンを右に寄せたいのでdiv
              <div></div>
            ) : (
              <Button text='戻る' icon='fas fa-arrow-left' onClick={() => this.DecrementIndex()} type='material' />
            )}
            {this.NextButton()}
          </div>
        </div>

        <Modal isOpen={this.state.isModalOpen} close={() => this.setState({isModalOpen: false})}>
          <div className={css.window}>
            <h1>🎉問題終了🎉</h1>
            <p>お疲れさまでした。</p>
            <p className={css.correct_rate}>
              <b>正答率{this.state.correct_rate}%</b>
              <br />（{this.total_questions}問中{this.correct_answers}問正解）
            </p>
            <ButtonContainer>
              {!this.props.history_id && !this.props.tag_filter && this.props.data.id !== undefined ? (
                <Button
                  {...{
                    text: '編集する',
                    icon: 'fas fa-pen',
                    type: 'material',
                    onClick: () => Router.push('/edit?id=' + this.props.data.id),
                  }}
                />
              ) : (
                <></>
              )}
              <Button
                {...{
                  text: '回答状況一覧',
                  icon: 'fas fa-list',
                  type: 'material',
                  onClick: () => this.setState({isModalOpen: false, showExamStateTable: true}),
                }}
              />
              <Button
                {...{
                  text: '前のページへ',
                  icon: 'fas fa-arrow-left',
                  type: 'filled',
                  onClick: Router.back,
                }}
              />
            </ButtonContainer>
          </div>
        </Modal>
      </>
    );
  }
}
