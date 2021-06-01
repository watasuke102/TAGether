// TAGether - Share self-made exam for classmates
// examtable.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/examtable.module.scss';
import React from 'react';
import Helmet from 'react-helmet';
import Router from 'next/router';
import { GetServerSideProps } from 'next';
import Button from '../components/Button';
import ExamTable from '../components/ExamTableComponent';
import GetFromApi from '../ts/Api';
import Exam from '../types/Exam';
import Categoly from '../types/Categoly';

interface Props {
  data: Categoly[],
  shuffle: boolean
}
interface States { showCorrectAnswer: boolean }

export default class examtable extends React.Component<Props, States> {
  private exam: Exam[];
  constructor(props: Props) {
    super(props);
    // 問題の取得、条件によってはシャッフル
    this.exam = JSON.parse(this.props.data[0].list);
    // Fisher-Yatesアルゴリズムらしい
    if (this.props.shuffle) {
      for (let i = this.exam.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        const tmp = this.exam[i];
        this.exam[i] = this.exam[r];
        this.exam[r] = tmp;
      }
    }
    this.state = { showCorrectAnswer: false };
  }
  render(): React.ReactElement {
    return (
      <>
        <Helmet title={`問題一覧 : ${this.props.data[0].title} - TAGether`} />
        <div className={css.table}>
          <ExamTable exam={this.exam} showCorrectAnswer={this.state.showCorrectAnswer} />
        </div>

        <div className={css.button_container}>
          <div className={css.buttons}>
            <Button {...{
              text: '戻る', icon: 'fas fa-undo',
              onClick: Router.back, type: 'material'
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
          </div>
        </div>
      </>
    );
  }
}

// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await GetFromApi<Categoly>(context.query.id);
  const props: Props = {
    data: data,
    shuffle: (context.query.shuffle == 'true') ? true : false
  };
  return { props: props };
};
