// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './profile.module.scss';
import React from 'react';
import Button from '@/common/Button/Button';
import {IndexedContainer} from '@/common/IndexedContainer';
import Loading from '@/common/Loading/Loading';
import CategoryCard from '@/features/CategoryCard/CategoryCard';
import {ExamHistoryItem} from './_components/ExamHistoryItem/ExamHistoryItem';
import {logout, useSession} from '@utils/api/session';
import {useUser} from '@utils/api/user';
import {useAllCategoryData} from '@utils/api/category';
import ArrowLeftIcon from '@assets/arrow-left.svg';
import {useAllHistory} from '@utils/api/history';

export default function profile(): React.ReactElement {
  useSession(true);
  const [user, is_user_loading] = useUser();
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
              <CategoryCard key={`card_${item.id}`} {...item} />
            </div>
          );
        })}
      </IndexedContainer>
    );
  };

  return (
    <>
      <div className={css.container}>
        <div className={css.user_info}>
          {is_user_loading ? <div /> : <span>{user.email} としてログイン中です。</span>}
          <Button type='filled' icon={<ArrowLeftIcon />} text='ログアウト' OnClick={logout} />
        </div>
        <h2>お気に入りカテゴリ</h2>
        <div className={css.favorite_category}>
          <FavoriteList />
        </div>

        <hr />

        <h2>解答履歴</h2>
        {is_history_loading ? (
          <Loading />
        ) : (
          <IndexedContainer len={histories.length} per={8}>
            {histories.map(item => {
              return <ExamHistoryItem key={`history_${item.id}`} {...item} />;
            })}
          </IndexedContainer>
        )}
      </div>
    </>
  );
}
