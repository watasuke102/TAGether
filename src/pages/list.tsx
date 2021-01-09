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
import { GetServerSideProps } from 'next'
import Categoly from '../types/Categoly'
import CategolyCard from '../components/Card';

export default function list({data}) {
  let cards: object[] = [];
  const list: Categoly[] = data;
  list.forEach(element => {
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