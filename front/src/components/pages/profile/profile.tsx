// TAGether - Share self-made exam for classmates
// profile.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './profile.module.scss';
import React from 'react';
import Helmet from 'react-helmet';
import Button from '@/common/Button/Button';
import Loading from '@/common/Loading/Loading';
import Modal from '@/common/Modal/Modal';
import {SelectButton} from '@/common/SelectBox';
import CategolyCard from '@/features/CategolyCard/CategolyCard';
import HistoryTable from '@/features/ExamHistoryTable/ExamHistoryTableItem';
import {useCategolyData} from '@/utils/Api';
import {GetExamHistory, GetFavorite, ClearExamHistory} from '@/utils/ManageDB';
import Categoly from '@mytypes/Categoly';
import ExamHistory from '@mytypes/ExamHistory';

export default function profile(): React.ReactElement {
  const [isModalOpen, SetIsModalOpen] = React.useState(false);
  const [isShuffleEnabled, SetIsShuffleEnabled] = React.useState(false);
  const [history_list, SetHistoryList] = React.useState<ExamHistory[]>([]);
  const [favorite_list, SetFavoriteList] = React.useState<number[]>([]);
  const [data, isLoading] = useCategolyData();

  const InitExamHistory = () => {
    GetExamHistory().then(res => {
      res.sort((_a, _b) => {
        const a = Number(_a.history_key ?? '');
        const b = Number(_b.history_key ?? '');
        if (a < b) return 1;
        if (a > b) return -1;
        return 0;
      });
      SetHistoryList(res);
    });
  };

  React.useEffect(() => {
    InitExamHistory();
    GetFavorite().then(res => SetFavoriteList(res));
  }, []);

  return (
    <>
      <Helmet title='プロフィール - TAGether' />

      <div className={css.container}>
        <h2>お気に入りカテゴリ</h2>
        <div className={css.favorite_categoly}>
          {isLoading ? (
            <Loading />
          ) : (
            data
              .filter(a => favorite_list.includes(a.id ?? -1))
              .map(item => {
                return <CategolyCard key={`card_${item.id}`} {...item} />;
              })
          )}
        </div>

        <h2>解答履歴</h2>
        <div className={css.buttons}>
          <div className={css.allclear_button}>
            <Button
              {...{
                text: '履歴を全消去',
                icon: 'fas fa-trash-alt',
                onClick: () => SetIsModalOpen(true),
                type: 'filled',
              }}
            />
          </div>
          {/* シャッフルするかどうかを決めるチェックボックス */}
          <SelectButton
            type='single'
            status={isShuffleEnabled}
            desc='解き直しのとき、問題順をシャッフルする'
            onChange={e => SetIsShuffleEnabled(e)}
          />
        </div>

        <table>
          <tbody>
            <tr>
              <th>日付</th>
              <th>カテゴリ名</th>
              <th>結果</th>
              <th>正答率</th>
              <th>間違えた問題を解く</th>
            </tr>
            {history_list.map(item => {
              const categoly: Categoly | undefined = data.find(a => a.id === item.id);
              if (categoly === undefined) return <></>;
              return (
                <HistoryTable
                  key={`history_${item.history_key}`}
                  item={item}
                  categoly={categoly}
                  isShuffleEnabled={isShuffleEnabled}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} close={() => SetIsModalOpen(false)}>
        <div className={css.window}>
          <p>解答履歴をすべて削除しますか？</p>
          <div className={css.window_buttons}>
            <Button
              {...{
                type: 'material',
                icon: 'fas fa-times',
                text: '閉じる',
                onClick: () => SetIsModalOpen(false),
              }}
            />
            <Button
              {...{
                onClick: () => {
                  ClearExamHistory().then(InitExamHistory);
                  SetIsModalOpen(false);
                },
                type: 'filled',
                icon: 'fas fa-trash-alt',
                text: '削除する',
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
