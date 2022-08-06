// TAGether - Share self-made exam for classmates
// examtable.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './examtable.module.scss';
import Router from 'next/router';
import React from 'react';
import Helmet from 'react-helmet';
import Button from '@/common/Button/Button';
import Loading from '@/common/Loading/Loading';
import ExamTableComponent from '@/features/ExamTable/ExamTableComponent';
import Categoly from '@mytypes/Categoly';
import Exam from '@mytypes/Exam';
import ExamHistory from '@mytypes/ExamHistory';

interface Props {
  data: Categoly;
  history?: ExamHistory;
}

export default function ExamTable(props: Props): React.ReactElement {
  const [showCorrectAnswer, SetShowCorrectAnswer] = React.useState(false);

  const rate = props.history && Math.round((props.history.correct_count / props.history.total_question) * 10000) / 100;
  const exam: Exam[] = JSON.parse(props.data.list);
  // 読み込みが終わっていなかった場合
  if (exam.length === 0 && props.history) {
    return <Loading />;
  }

  return (
    <>
      <Helmet title={`問題一覧 : ${props.data.title} - TAGether`} />

      <div className={css.examdata_container}>
        <span className={css.title}>{props.data.title}</span>
        <div className={css.correct_rate_statuslist}>
          {props.history && (
            <span>
              {props.history.total_question}問中{props.history.correct_count}問正解、 正答率{rate}%
            </span>
          )}
        </div>
      </div>

      <div className={css.table}>
        <ExamTableComponent exam={exam} showCorrectAnswer={showCorrectAnswer} />
      </div>

      <div className={css.button_container}>
        <div className={css.buttons}>
          <Button text='戻る' icon='fas fa-undo' onClick={Router.back} type='material' />
          {/* 正しい答えの表示/非表示切り替え */}
          <Button
            onClick={() => SetShowCorrectAnswer(!showCorrectAnswer)}
            type='material'
            text={showCorrectAnswer ? '正解を非表示' : '正解を表示'}
            icon={showCorrectAnswer ? 'fas fa-eye-slash' : 'fas fa-eye'}
          />
        </div>
      </div>
    </>
  );
}
