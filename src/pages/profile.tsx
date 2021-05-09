// TAGether - Share self-made exam for classmates
// profile.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/profile.module.scss';
import React from 'react';
import { GetServerSideProps } from 'next';
import CategolyCard from '../components/Card';
import HistoryTable from '../components/ExamHistoryTableItem';
import { GetExamHistory, GetFavorite } from '../ts/ManageDB';
import Categoly from '../types/Categoly';
import ExamHistory from '../types/ExamHistory';

interface Props { data: Categoly[] }

export default function profile(props: Props) {
  const [history_list, SetHistoryList] = React.useState<ExamHistory[]>([]);
  const [favorite_list, SetFavoriteList] = React.useState<number[]>([]);
  React.useEffect(() => {
    GetExamHistory().then(res => SetHistoryList(res))
    GetFavorite().then(res => SetFavoriteList(res))
  }, []);

  return (
    <>
      <div className={css.container}>
        <h2>お気に入りカテゴリ</h2>
        <div className={css.favorite_categoly}>
          {
            props.data
              .filter(a => favorite_list.includes(a.id ?? -1))
              .map(item => {
                return <CategolyCard {...item} />
              })
          }
        </div>
        <h2>解答履歴</h2>
        <table>
          <tr>
            <th>日付</th> <th>カテゴリ名</th> <th>結果</th> <th>正答率</th>
          </tr>
          {
            history_list.map(item => {
              const categoly: Categoly | undefined = props.data.find(a => a.id === item.id);
              if (categoly === undefined) return <></>;
              return <HistoryTable categoly={categoly} item={item} />
            })
          }
        </table>
      </div>

    </>
  );
}


// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(process.env.API_URL ?? '');
  const data = await res.json();
  return { props: { data } };
}
