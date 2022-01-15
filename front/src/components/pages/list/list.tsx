// TAGether - Share self-made exam for classmates
// list.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './list.module.scss';
import Router from 'next/router';
import React from 'react';
import Helmet from 'react-helmet';
import Button from '@/common/Button/Button';
import {IndexedContainer} from '@/common/IndexedContainer';
import Loading from '@/common/Loading/Loading';
import {SingleSelectBox} from '@/common/SelectBox';
import Form from '@/common/TextForm/Form';
import CategolyCard from '@/features/CategolyCard/CategolyCard';
import {useCategolyData} from '@/utils/Api';
import Categoly from '@mytypes/Categoly';

export default function list(): React.ReactElement {
  const [searchStr, SetSearchStr] = React.useState('');
  const [radioState, SetRadioState] = React.useState('タイトル');
  const [newer_first, SetNewerFirst] = React.useState(true);
  const [list, isLoading] = useCategolyData();

  function CardList(): React.ReactElement[] {
    let cards: React.ReactElement[] = [];
    let searchResult: Categoly[] = [];
    cards = [];
    // 検索欄になにか記入されていたら、検索
    if (searchStr !== '') {
      list.forEach(e => {
        let text: string = '';
        switch (radioState) {
          case 'タイトル':
            text = e.title;
            break;
          case '説明':
            text = e.description;
            break;
          case 'ID':
            if (e.id?.toString() !== undefined) text = e.id.toString();
            break;
          case 'タグ':
            e.tag.forEach(a => (text += `${a.name},`));
            text = text.slice(0, -1);
            break;
        }
        // 検索欄に入力された文字と一致したら検索結果に追加
        if (text.indexOf(searchStr) !== -1) searchResult.push(e);
      });
    } else {
      searchResult = list;
    }
    // 検索結果からカードを生成
    if (searchResult.length === 0) {
      cards.push(
        <p key={'result_404'} className={css.notfound}>
          見つかりませんでした
        </p>,
      );
    } else {
      searchResult.forEach(element => {
        cards.push(<CategolyCard key={`card_${element.id}`} {...element} />);
      });
    }
    if (newer_first) {
      cards.reverse();
    }

    // カテゴリ作成ページへ飛ぶカードを追加
    cards.unshift(
      <div key={'newcategoly'} className={css.card} onClick={() => Router.push('/create')}>
        <span className='fas fa-plus' />
        <p id={css.create_new}>新規作成</p>
      </div>,
    );
    return cards;
  }

  return (
    <>
      <Helmet title='カテゴリ一覧 - TAGether' />
      <h1>カテゴリ一覧</h1>
      <div className={css.form}>
        {/* 検索欄 */}
        <Form
          {...{
            label: '検索',
            value: searchStr,
            rows: 1,
            onChange: ev => SetSearchStr(ev.target.value),
          }}
        />
        <Button
          {...{
            text: '入力のクリア',
            icon: 'fas fa-times',
            onClick: () => SetSearchStr(''),
            type: 'filled',
          }}
        />
        {/* 何を検索するか選択 */}
        <div className={css.radiobutton_container}>
          <SingleSelectBox
            onChange={txt => SetRadioState(txt)}
            status={radioState}
            list={['タイトル', 'タグ', '説明', 'ID']}
          />
        </div>

        <div className={css.sort}>
          <p>{newer_first ? '新しい順' : '古い順'}に並べています。</p>
          <Button
            type='material'
            text={newer_first ? '古い順に並べる' : '新しい順に並べる'}
            icon={'fas fa-sort-numeric-' + (newer_first ? 'down-alt' : 'down')}
            onClick={() => SetNewerFirst(!newer_first)}
          />
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <IndexedContainer len={list.length} width={300}>
          {CardList()}
        </IndexedContainer>
      )}
    </>
  );
}
