// TAGether - Share self-made exam for classmates
// tag.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/tag.module.scss';
import React from 'react';
import { GetServerSideProps } from 'next';
import GetFromApi from '../ts/Api';
import TagData from '../types/TagData';

interface Props { tag: TagData[] }

export default function tag({ tag }: Props): React.ReactElement {
  return (
    <>
      <h1>タグ一覧</h1>
      <ul>
        {
          tag.map(e => <li key={`taglist_${e.id}`}>{e.name}</li>)
        }
      </ul>
    </>
  );
}


// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await GetFromApi<TagData>('tag', context.query.id);
  return { props: { tag: data } };
};
