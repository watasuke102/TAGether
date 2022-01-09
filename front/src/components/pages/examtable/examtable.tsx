// TAGether - Share self-made exam for classmates
// examtable.tsx
//
// CopyRight (c) 2020-2021 Watasuke
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
import {useCategolyData} from '@/utils/Api';

export default function ExamTable(): React.ReactElement {
  const [data, isLoading] = useCategolyData();
  const [showCorrectAnswer, SetShowCorrectAnswer] = React.useState(false);

  if (isLoading) return <Loading />;

  return (
    <>
      <Helmet title={`問題一覧 : ${data[0].title} - TAGether`} />
      <div className={css.table}>
        <ExamTableComponent exam={JSON.parse(data[0].list)} showCorrectAnswer={showCorrectAnswer} />
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
