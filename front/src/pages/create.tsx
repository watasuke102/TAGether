// TAGether - Share self-made exam for classmates
// create.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react';
import {GetServerSideProps} from 'next';
import {Create} from '@/pages/create';
import GetFromApi from '@/utils/Api';
import TagData from '@mytypes/TagData';
import Categoly from '@mytypes/Categoly';

interface Props {
  tags: TagData[];
  data: Categoly[];
}

export default function CreatePage(props: Props): React.ReactElement {
  return <Create mode={'create'} {...props} />;
}

// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async context => {
  const tags = await GetFromApi<TagData>('tag', context.query.id);
  const data = await GetFromApi<Categoly>('categoly', context.query.id);
  return {props: {tags: tags, data: data}};
};
