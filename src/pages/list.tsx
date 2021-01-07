// TAGether - Share self-made exam for classmates
// list.tsx
//
// CopyRight (c) 2020 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react';
import { GetServerSideProps } from 'next'
import Categoly from '../types/categoly'
import CategolyCard from '../components/Card';

export default ({ data }) => {
  let cards: object[] = [];
  const list: Categoly[] = data;
  list.forEach(element => {
    cards.push(<CategolyCard title={element.title} desc={element.desc} />);
  });
  return (
    <div>
      <h1>List</h1>
      {cards}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let query: string = '';
  const res = await fetch(`http://api.watasuke.tk`+query);
  const data = await res.json();
  return {props:{data}};
}