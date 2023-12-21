// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './profile.module.scss';
import React from 'react';
import Helmet from 'react-helmet';
import Button from '@/common/Button/Button';
import {IndexedContainer} from '@/common/IndexedContainer';
import Loading from '@/common/Loading/Loading';
import Modal from '@/common/Modal/Modal';
import CategolyCard from '@/features/CategolyCard/CategolyCard';
import HistoryTable from '@/features/ExamHistoryTable/ExamHistoryItem';
import {useAllCategoryData} from '@utils/ApiHooks';
import {GetExamHistory, GetFavorite, ClearExamHistory, RemoveExamHistory} from '@utils/ManageDB';
import ExamHistory from '@mytypes/ExamHistory';

export default function profile(): React.ReactElement {
  const [is_modal_open, SetIsModalOpen] = React.useState(false);
  const [history_list, SetHistoryList] = React.useState<ExamHistory[]>([]);
  const [favorite_list, SetFavoriteList] = React.useState<number[]>([]);
  const [data, isLoading] = useAllCategoryData();

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

  const FavoriteList = () => {
    if (isLoading) return <Loading />;
    const list = data.filter(a => favorite_list.includes(a.id ?? -1));
    return (
      <IndexedContainer len={list.length} width='300px' per={6}>
        {list.map((item, i) => {
          return (
            <div className={css.card_wrapper} key={`favorite_${i}`}>
              <CategolyCard key={`card_${item.id}`} {...item} />
            </div>
          );
        })}
      </IndexedContainer>
    );
  };

  return (
    <>
      <Helmet title='プロフィール - TAGether' />

      <div className={css.container}>
        <h2>お気に入りカテゴリ</h2>
        <div className={css.favorite_categoly}>
          <FavoriteList />
        </div>

        <hr />

        <h2>解答履歴</h2>
        <div className={css.buttons}>
          <div className={css.allclear_button}>
            <Button
              {...{
                text: '履歴を全消去',
                icon: 'fas fa-trash-alt',
                OnClick: () => SetIsModalOpen(true),
                type: 'filled',
              }}
            />
          </div>
        </div>

        <IndexedContainer len={history_list.length} per={8}>
          {history_list.map(item => {
            return (
              <HistoryTable
                key={`history_${item.history_key}`}
                item={item}
                categoly={item.categoly}
                remove={() => {
                  RemoveExamHistory(item.history_key ?? '');
                  const tmp = history_list.concat();
                  // history_keyが存在しない場合は何も削除しない
                  tmp.splice(Number(item.history_key ?? tmp.length), 1);
                  SetHistoryList(tmp);
                }}
              />
            );
          })}
        </IndexedContainer>
      </div>

      <Modal isOpen={is_modal_open} close={() => SetIsModalOpen(false)}>
        <div className={css.modal}>
          <p>解答履歴をすべて削除しますか？</p>
          <div className={css.window_buttons}>
            <Button
              {...{
                type: 'material',
                icon: 'fas fa-times',
                text: '閉じる',
                OnClick: () => SetIsModalOpen(false),
              }}
            />
            <Button
              {...{
                OnClick: () => {
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
