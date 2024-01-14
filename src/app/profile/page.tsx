// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
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
import {logout, useSession} from '@utils/api/session';
import {useUser} from '@utils/api/user';
import {useAllCategoryData} from '@utils/api/category';
import DeleteIcon from '@assets/delete.svg';
import CloseIcon from '@assets/close.svg';
import ArrowLeftIcon from '@assets/arrow-left.svg';
import {useAllHistory} from '@utils/api/history';

export default function profile(): React.ReactElement {
  useSession(true);
  const [user, is_user_loading] = useUser();
  const [is_modal_open, SetIsModalOpen] = React.useState(false);
  const [histories, is_history_loading] = useAllHistory();
  const [data, isLoading] = useAllCategoryData();

  const FavoriteList = () => {
    if (isLoading || is_user_loading) return <Loading />;
    const list = data.filter(a => user.favorite_list.includes(a.id ?? -1));
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
        <div className={css.user_info}>
          {is_user_loading ? <div /> : <span>{user.email} としてログイン中です。</span>}
          <Button type='filled' icon={<ArrowLeftIcon />} text='ログアウト' OnClick={logout} />
        </div>
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
                icon: <DeleteIcon />,
                OnClick: () => SetIsModalOpen(true),
                type: 'filled',
              }}
            />
          </div>
        </div>

        {is_history_loading ? (
          <Loading />
        ) : (
          <IndexedContainer len={histories.length} per={8}>
            {histories.map(item => {
              return (
                <div key={item.id} style={{whiteSpace: 'pre-wrap'}}>
                  {JSON.stringify(item, undefined, '  ')}
                </div>
                // <HistoryTable
                //   key={`history_${item.history_key}`}
                //   item={item}
                //   categoly={item.categoly}
                //   remove={() => {
                //     RemoveExamHistory(item.history_key ?? '');
                //     const tmp = history_list.concat();
                //     // history_keyが存在しない場合は何も削除しない
                //     tmp.splice(Number(item.history_key ?? tmp.length), 1);
                //     SetHistoryList(tmp);
                //   }}
                // />
              );
            })}
          </IndexedContainer>
        )}
      </div>

      <Modal isOpen={is_modal_open} close={() => SetIsModalOpen(false)}>
        <div className={css.modal}>
          <p>解答履歴をすべて削除しますか？</p>
          <div className={css.window_buttons}>
            <Button
              {...{
                type: 'material',
                icon: <CloseIcon />,
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
                icon: <DeleteIcon />,
                text: '削除する',
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
