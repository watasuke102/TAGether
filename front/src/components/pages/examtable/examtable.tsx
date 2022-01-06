// TAGether - Share self-made exam for classmates
// examtable.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './examtable.module.scss';
import React from 'react';
import Helmet from 'react-helmet';
import Router from 'next/router';
import Button from '../../common/Button/Button';
import ExamTableComponent from '../../features/ExamTable/ExamTableComponent';
import Exam from '../../../types/Exam';
import Categoly from '../../../types/Categoly';

interface Props {
  data: Categoly[];
  shuffle: boolean;
}

export default function ExamTable(props: Props): React.ReactElement {
  const [showCorrectAnswer, SetShowCorrectAnswer] = React.useState(false);

  const exam: Exam[] = JSON.parse(props.data[0].list);
  // Fisher-Yatesアルゴリズムらしい
  if (props.shuffle) {
    for (let i = exam.length - 1; i > 0; i--) {
      const r = Math.floor(Math.random() * (i + 1));
      const tmp = exam[i];
      exam[i] = exam[r];
      exam[r] = tmp;
    }
  }
  return (
    <>
      <Helmet title={`問題一覧 : ${props.data[0].title} - TAGether`} />
      <div className={css.table}>
        <ExamTableComponent exam={exam} showCorrectAnswer={showCorrectAnswer} />
      </div>

      <div className={css.button_container}>
        <div className={css.buttons}>
          <Button
            {...{
              text: '戻る',
              icon: 'fas fa-undo',
              onClick: Router.back,
              type: 'material',
            }}
          />
          {/* 正しい答えの表示/非表示切り替え */}
          <Button
            {...{
              onClick: () => SetShowCorrectAnswer(!showCorrectAnswer),
              type: 'material',
              text: showCorrectAnswer ? '正解を非表示' : '正解を表示',
              icon: showCorrectAnswer ? 'fas fa-eye-slash' : 'fas fa-eye',
            }}
          />
        </div>
      </div>
    </>
  );
}
