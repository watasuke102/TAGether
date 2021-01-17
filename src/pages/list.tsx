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
import { GetServerSideProps } from 'next';
import Form from '../components/Form';
import CategolyCard from '../components/Card';
import Categoly from '../types/Categoly';

interface Props { data: Categoly[] }


export default function list(props: Props) {
  const [searchStr, SetSearchStr] = React.useState('');
  const [radioState, SetRadioState] = React.useState('タイトル');
  let cards: object[] = [];
  const list: Categoly[] = props.data;
  
  const RadioButton = (s: string) => {
    return (
      <div className={css.radiobutton}>
        <input type='radio' value={s} checked={radioState == s}
          onChange={() => SetRadioState(s)} />
        <p>{s}</p>
      </div>
    );
  }

  // カードの生成
  const CreateCards = () => {
    let searchResult: Categoly[] = [];
    // 検索欄になにか記入されていたら、検索
    if (searchStr != '') {
      list.forEach(e => {
        let text: string = '';
        switch (radioState) {
          case 'ID':
            if (e.id?.toString() != undefined)
              text = e.id.toString();
            break;
          case 'タイトル': text = e.title; break;
          case 'タグ'    : text = e.tag;   break;
          case '説明'    : text = e.desc;  break;
        }
        // 検索欄に入力された文字と一致したら検索結果に追加
        if (text.indexOf(searchStr) != -1)
          searchResult.push(e);
      });
    } else {
      searchResult = list;
    }
    // 検索結果からカードを生成
    if (searchResult == undefined) {
      cards.push(<p>見つかりませんでした</p>);
      return;
    }
    searchResult.forEach(element => {
      cards.push(<CategolyCard {...element} />);
    });
  }
  
  // カテゴリ作成ページへ飛ぶカードを追加
  cards.push(
    <div className={css.card} onClick={() => Router.push('/create')}>
      <div className='fas fa-plus' />
      <p>新規作成</p>
    </div>
  );
  CreateCards();


  return (
    <>
      <h1>カテゴリ一覧</h1>
      <div className={css.form}>
        <Form {...{
          label: '検索', value: searchStr, rows: 1,
          onChange: (ev) => SetSearchStr(ev.target.value)
        }} />
        <div className={css.radiobutton_container}>
          {RadioButton('タイトル')}
          {RadioButton('タグ')}
          {RadioButton('説明')}
          {RadioButton('ID')}
        </div>
      </div>
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
  const res = await fetch(process.env.API_URL+query);
  const data = await res.json();
  return {props:{data}};
}