// TAGether - Share self-made exam for classmates
// list.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/list.module.scss'
import React from 'react';
import Helmet from 'react-helmet';
import Router from 'next/router';
import { GetServerSideProps } from 'next';
import Form from '../components/Form';
import SelectBox from '../components/SelectBox';
import Button from '../components/Button';
import CategolyCard from '../components/Card';
import Categoly from '../types/Categoly';
import ButtonInfo from '../types/ButtonInfo';

interface Props { data: Categoly[] }


export default function list(props: Props) {
  const [searchStr, SetSearchStr] = React.useState('');
  const [radioState, SetRadioState] = React.useState('タイトル');
  const [newer_first, SetNewerFirst] = React.useState(true);

  let cards: object[] = [];
  const list: Categoly[] = props.data;

  // カードの生成
  const CreateCards = () => {
    let searchResult: Categoly[] = [];
    cards = [];
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
          case 'タグ': text = e.tag; break;
          case '説明': text = e.desc; break;
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
    if (newer_first) {
      cards.reverse();
    }

    // カテゴリ作成ページへ飛ぶカードを追加
    cards.unshift(
      <div className={css.card} onClick={() => Router.push('/create')}>
        <div className='fas fa-plus' />
        <p>新規作成</p>
      </div>
    );
  }

  CreateCards();

  const info: ButtonInfo = {
    type: 'material',
    text: newer_first ? '古い順に並べる' : '新しい順に並べる',
    icon: 'fas fa-sort-numeric-' + (newer_first ? 'down-alt' : 'down'),
    onClick: () => {
      CreateCards();
      SetNewerFirst(!newer_first);
    }
  }

  return (
    <>
      <Helmet title='カテゴリ一覧 - TAGether' />
      <h1>カテゴリ一覧</h1>
      <div className={css.form}>
        {/* 検索欄 */}
        <Form {...{
          label: '検索', value: searchStr, rows: 1,
          onChange: (ev) => SetSearchStr(ev.target.value)
        }} />
        <Button {...{
          text: '入力のクリア', icon: 'fas fa-times',
          onClick: () => SetSearchStr(''), type: 'filled'
        }} />
        {/* 何を検索するか選択 */}
        <div className={css.radiobutton_container}>
          <SelectBox onChange={txt => SetRadioState(txt)} status={radioState}
            list={['タイトル', 'タグ', '説明', 'ID']} />
        </div>

        <div className={css.sort}>
          <p>{newer_first ? '新しい順' : '古い順'}に並べています。</p>
          <Button {...info} />
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
    query = '?id=' + context.query.id;
  }
  let data;
  try {
    const res = await fetch(process.env.API_URL + query);
    data = await res.json();
  } catch {
    data = []
  }
  return { props: { data } };
}