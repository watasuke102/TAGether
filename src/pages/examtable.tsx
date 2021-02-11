// TAGether - Share self-made exam for classmates
// examtable.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/examtable.module.css';
import React from 'react';
import Router from 'next/router';
import { GetServerSideProps } from 'next';
import Button from '../components/Button';
import ExamTable from '../components/ExamTableComponent';
import Exam from '../types/Exam';
import Categoly from '../types/Categoly';

interface Props {
  data: Categoly[],
  shuffle: boolean
}
export default class examtable extends React.Component<Props> {
  private exam: Exam[];
  constructor(props: Props) {
    super(props);
    // 問題の取得、条件によってはシャッフル
    this.exam = JSON.parse(this.props.data[0].list);
    // Fisher-Yatesアルゴリズムらしい
    if (this.props.shuffle) {
      for (let i = this.exam.length - 1; i > 0; i--) {
        var r = Math.floor(Math.random() * (i + 1));
        var tmp = this.exam[i];
        this.exam[i] = this.exam[r];
        this.exam[r] = tmp;
      }
    }
  }
  render() {
    return (
      <>
        <div className={css.table}>
          <ExamTable {...{exam: this.exam}} />
        </div>

        <div className={css.button_container}>
          <div className={css.buttons}>
            <Button {...{
              text: "戻る", icon: "fas fa-undo",
              onClick: () => Router.push('/list'), type: "material"
            }} />
          </div>
        </div>
      </>
    );
  }
}

// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(process.env.API_URL + '?id=' + context.query.id);
  const data = await res.json();
  const props: Props = {
    data: data,
    shuffle: (context.query.shuffle == 'true') ? true:false
  };
  return {props: props};
}
