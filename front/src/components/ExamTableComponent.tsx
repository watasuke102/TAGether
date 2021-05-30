// TAGether - Share self-made exam for classmates
// ExamTableComponent.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/ExamTableComponent.module.scss';
import React from 'react';
import Exam from '../types/Exam';
import ExamState from '../types/ExamState';

interface Props {
  showCorrectAnswer: boolean,
  exam: Exam[],
  examState?: ExamState[],
  answers?: string[][],
}
interface State {
  array: number[];
}

export default class ExamTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // 連番配列を作成
    let array: number[] = [];
    for (let i = 0; i < this.props.exam.length; i++)
      array.push(i);
    // examStateのorder順にソート
    if (this.props.examState) {
      const first: number[] = [];
      const second: number[] = [];
      const third: number[] = array;

      this.props.examState.forEach((e, i) => {
        switch (e.order) {
          case 2: first.push(third[i]); third[i] = -1; break;
          case 1: second.push(third[i]); third[i] = -1; break;
          case 0: break;
        }
      });
      // 連結する
      // 条件に合うorderがなかった場合、配列がundefinedになるため、それをfilterで削除
      array = first.concat(second.concat(third)).filter(e => (e != undefined && e != -1));
    }
    this.state = { array: array };
  }

  ParseAnswers(e: string[], i: number): string {
    let answers: string = '';
    const length = this.props.exam[i].answer.length;
    if (length == 1) {
      return e[0] + '\n';
    }
    for (let j = 0; j < length; j++) {
      answers += (j + 1) + '問目: ' + e[j] + '\n';
    }
    return answers;
  }

  Status(i: number): React.ReactElement | undefined {
    if (!this.props.examState || !this.props.answers) return;
    const ans = this.ParseAnswers(this.props.answers[i], i);
    // 正解or不正解、もしくはn問正解の表示
    const count = this.props.examState[i].correctAnswerCount;
    let correct_state: string = '';
    if (this.props.exam[i].answer.length == 1) {
      correct_state = (count == 1) ? '正解' : '不正解';
    } else {
      correct_state = count + '問正解';
    }
    return (
      <>
        <td>{
          // 一番最後に改行文字があるので、それを削除してから
          ans.slice(0, -1).split('\n').map(str => {
            return (<> {str}<br /> </>);
          })
        }</td>
        <td>{correct_state}</td>
      </>
    );
  }

  RealAnswerList(e: Exam, i: number): React.ReactElement[] {
    if (this.props.examState) {
      return this.props.examState[i].realAnswerList;
    }
    const ans = this.ParseAnswers(e.answer, i);
    const list: React.ReactElement[] = [];
    // 一番最後に改行文字があるので、それを削除してから
    ans.slice(0, -1).split('\n').map(str => {
      list.push(<> {str}<br /> </>);
    });
    return list;
  }

  render(): React.ReactElement {
    const list: React.ReactElement[] = [];
    const exam = this.props.exam;
    this.state.array.forEach(i => {
      list.push(
        <tr>
          <td>{
            exam[i].question.split('\n').map(str => {
              return (<> {str}<br /> </>);
            })
          }</td>
          <td className={this.props.showCorrectAnswer ? '' : css.hide_correct_answer}>
            <p>{this.RealAnswerList(exam[i], i)}</p>
          </td>
          {this.Status(i)}
        </tr>
      );
    });
    let state_th: React.ReactElement = <></>;
    if (this.props.examState && this.props.answers)
      state_th = <><th>自分の解答</th> <th>状態</th></>;
    return (
      <>
        <div className={css.table}>
          <table>
            <tr>
              <th>問題</th>
              <th>正解</th>
              {state_th}
            </tr>
            {list}
          </table>
        </div>

        <div className={css.bottom} />
      </>
    );
  }
}
