// TAGether - Share self-made exam for classmates
// list.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/list.module.css'
import React from 'react';
import Router from 'next/router';
import { GetServerSideProps } from 'next'
import CategolyCard from '../components/Card';
import Categoly from '../types/Categoly'

export default function list({data}) {
  let cards: object[] = [];
  const list: Categoly[] = data;
  let tmp: Categoly;
  // 問題作成ページへ飛ぶカードを追加
  cards.push(
    <div className={css.card_create} onClick={() => Router.push('/create')}>
      <div className='fas fa-plus' />
      <p>新規作成</p>
    </div>
  );
  // リストから
  list.forEach(element => {
    cards.push(<CategolyCard data={element} />);
  });
  return (
    <>
    <h1>カテゴリ一覧</h1>
    <div className={css.list}> {cards} </div>
    </>
  );
}

// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async (context) => {
  let query: string = '';
  if (context.query.id) {
    query = '?id='+context.query.id;
  }
  const res = await fetch(`https://api.watasuke.tk`+query);
  const data = await res.json();
  return {props:{data}};
}