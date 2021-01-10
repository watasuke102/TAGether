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
    <div className={css.card_create}>
      <div className='fas fa-plus' />
      <p>新規作成</p>
    </div>
  );
  // リストから
  list.forEach(element => {
    tmp = element;
    // タイトルを25文字以内に
    if (tmp.title.length > 25) {
      tmp.title = element.title.slice(0, 25) + '...';
    }
    // 説明を100文字以内に
    if (tmp.desc.length > 100) {
      tmp.desc = element.desc.slice(0, 100) + '...';
    }
    cards.push(<CategolyCard data={element} />);
  });
  return (
    <>
    <h1>List</h1>
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
  const res = await fetch(`http://api.watasuke.tk`+query);
  const data = await res.json();
  return {props:{data}};
}