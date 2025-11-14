// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './profile.module.scss';
import ArrowLeftIcon from '@assets/arrow-left.svg';
import React from 'react';
import Button from '@/common/Button/Button';
import {IndexedContainer} from '@/common/IndexedContainer';
import Loading from '@/common/Loading/Loading';
import CategoryCard from '@/features/CategoryCard/CategoryCard';
import {logout, useSession} from '@utils/api/session';
import {useUser} from '@utils/api/user';
import {useAllCategoryData} from '@utils/api/category';
import {useAllHistory} from '@utils/api/history';
import {AllCategoryDataType} from '@mytypes/Category';
import {ExamHistoryItem} from './_components/ExamHistoryItem/ExamHistoryItem';

function FavoriteList(props: {
  isLoading: boolean;
  is_user_loading: boolean;
  data: AllCategoryDataType[];
  user: {favorite_list: number[]};
}) {
  if (props.isLoading || props.is_user_loading) return <Loading />;
  const list = props.data.filter(a => props.user.favorite_list.includes(a.id ?? -1));
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
}

export default function Profile(): React.ReactElement {
  useSession(true);
  const [user, is_user_loading] = useUser();
  const [histories, is_history_loading] = useAllHistory();
  const [data, isLoading] = useAllCategoryData();

  return (
    <>
      <div className={css.container}>
        <div className={css.user_info}>
          {is_user_loading ? <div /> : <span>{user.email} としてログイン中です。</span>}
          <Button variant='filled' icon={<ArrowLeftIcon />} text='ログアウト' OnClick={logout} />
        </div>
        <h2>お気に入りカテゴリ</h2>
        <div className={css.favorite_category}>
          <FavoriteList isLoading={isLoading} is_user_loading={is_user_loading} data={data} user={user} />
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
