// TAGether - Share self-made exam for classmates
// categoly-detail.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/categoly-detail.module.css'
import React from 'react';
import { GetServerSideProps } from 'next'
import Categoly from '../types/Categoly'
import Tag from '../components/Tag'

export default ({ data }) => {
  let exam_list: object[] = [];
  const list: Categoly = data[0];
  const exam = JSON.parse(list.list);
  exam.forEach(element => {
    exam_list.push(
      <ul>
        <li>{element.question}</li>
        <li>{element.answer}</li>
      </ul>);
  });
  return (
    <>
      <h1>{list.title}</h1>
      <h2>{list.desc}</h2>

      <div className={css.updated_at}>
        <div className='fas fa-clock'></div>
        <p>{list.updated_at}</p>
      </div>

      <Tag tag={list.tag} />

      {exam_list}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = '?id='+context.query.id;
  const res = await fetch(`http://api.watasuke.tk`+query);
  const data = await res.json();
  return {props:{data}};
}