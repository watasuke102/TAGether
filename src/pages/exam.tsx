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
import { GetServerSideProps } from 'next'
import Button from '../components/Button';

export default class list extends React.Component {
  public exam;
  constructor(props) {
    super(props);
    this.state = { index: 0, icon:'arrow-right', text: '次へ' };
    this.exam = JSON.parse(this.props.data[0].list);
  }
  // indexを増減する
  IncrementIndex() {
    // 最後の問題であれば、ボタンの内容を変化させる
    if (this.state.index+1 == this.exam.length - 1)
    this.setState({ icon: 'check', text: '終了' });
    this.setState({ index: this.state.index + 1 });
  }
  DecrementIndex() {
    if (this.state.index == 0) return;
    // 最後の問題からひとつ前に戻る時、ボタンの内容をもとに戻す
    if (this.state.index == this.exam.length - 1)
      this.setState({ icon: 'arrow-right', text: '次へ' });
    this.setState({ index: this.state.index - 1 });
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
  render() {
    const index = this.state.index;
    return (
      <>
        <h1>exam</h1>

        <div className={css.display}>
          <p>{this.exam[index].question}</p>
          <p>{this.exam[index].answer}</p>
        </div>

        <div className={css.buttons}>
          {this.BackButton()}
          <Button info={{
            text: this.state.text, icon: 'fas fa-'+this.state.icon,
            onClick: () => this.IncrementIndex(), type: 'material'
          }} />
        </div>
 
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