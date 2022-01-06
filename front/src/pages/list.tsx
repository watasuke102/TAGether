// TAGether - Share self-made exam for classmates
// .tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react';
import {GetServerSideProps} from 'next';
import {List} from '@/pages/list';
import GetFromApi from '@/utils/Api';
import TagData from '@mytypes/TagData';
import Categoly from '@mytypes/Categoly';

interface Props {
  tags: TagData[];
  data: Categoly[];
}

export default function ListPage(props: Props): React.ReactElement {
  return <List {...props} />;
}

// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async context => {
  const tags = await GetFromApi<TagData>('tag', undefined);
  const data = await GetFromApi<Categoly>('categoly', context.query.id);
  return {props: {tags: tags, data: data}};
};
