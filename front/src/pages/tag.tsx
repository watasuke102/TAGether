// TAGether - Share self-made exam for classmates
// tag.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react';
import {GetServerSideProps} from 'next';
import {Tag} from '@/pages/tag';
import GetFromApi from '@/utils/Api';
import TagData from 'types/TagData';
import Categoly from 'types/Categoly';

interface Props {
  tags: TagData[];
  data: Categoly[];
}

export default function TagPage(props: Props): React.ReactElement {
  return <Tag {...props} />;
}

// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async context => {
  const tags = await GetFromApi<TagData>('tag', context.query.id);
  return {props: {tags: tags}};
};
