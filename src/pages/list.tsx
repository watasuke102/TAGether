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
import GenerateList from '../api/LoadListFromDB'
import ExamCard from '../components/Card';

export default ({cards}) => {
    return (
      <div>
        <h1>List</h1>
        <ul>
          {cards}
        </ul>
      </div>
    )
  }

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log(context.query);
  let cards: object[] = [];
    GenerateList().forEach(element => {
      cards.push(<ExamCard title={element.title} desc={element.desc} />);
    });
  return {props:{cards}};
}