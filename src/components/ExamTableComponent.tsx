// TAGether - Share self-made exam for classmates
// ExamTableComponent.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/ExamTableComponent.module.css';
import React from 'react';
import Exam from '../types/Exam';
import ExamState from '../types/ExamState';

interface Props {
  exam:       Exam[],
  examState?: ExamState[],
  answers?:   string[][]
}
export default class ExamTable extends React.Component<Props> {
  ParseAnswers(e: string[], i: number) {
    let answers: string = '';
    const length = this.props.exam[i].answer.length;
    if (length == 1) {
      return e[0] + '\n';
    }
    for (let j = 0; j < length; j++) {
      answers += (j+1)+'問目: '+e[j]+'\n';
    }
    return answers;
  }

  Status(i: number) {
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
    )
  }

  RealAnswerList(e: Exam, i: number) {
    if (this.props.examState) {
      return this.props.examState[i].realAnswerList
    }
    const ans = this.ParseAnswers(e.answer, i);
    let list: Object[] = [];
    // 一番最後に改行文字があるので、それを削除してから
    ans.slice(0, -1).split('\n').map(str => {
      list.push(<> {str}<br /> </>);
    });
    return list;
  }
  
  render() {
    let list: Object[] = [];
    this.props.exam.forEach((e,i) => {
      list.push(
        <tr>
          <td>{
            e.question.split('\n').map(str => {
              return (<> {str}<br /> </>);
            })
          }</td>
          <td>{this.RealAnswerList(e, i)}</td>
          {this.Status(i)}
        </tr>
      )
    });
    let state_th: object = <></>;
    if (this.props.examState && this.props.answers)
      state_th = <><th>自分の解答</th> <th>状態</th></>
    return (
      <>
        <div className={css.table}>
          <table>
            <tr>
              <th>問題</th>
              <th>解答</th>
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
