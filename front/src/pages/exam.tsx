// TAGether - Share self-made exam for classmates
// exam.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import {Exam} from '@/pages/exam';
import {GetServerSideProps} from 'next';
import React from 'react';
import GetFromApi from '@/utils/Api';
import Categoly from '@mytypes/Categoly';

interface Props {
  data: Categoly[];
  shuffle: boolean;
  id: number;
  history_id?: string;
  tag_filter?: string;
}

export default function ExamPage(props: Props): React.ReactElement {
  return <Exam {...props} />;
}

export const getServerSideProps: GetServerSideProps = async context => {
  // 解答履歴からのやり直し
  if (context.query.history_id !== undefined) {
    return {
      props: {
        data: [],
        id: -1,
        shuffle: context.query.shuffle === 'true',
        history_id: context.query.history_id,
      },
    };
  }
  const data = await GetFromApi<Categoly>('categoly', context.query.id);
  const props: Props = {
    data: data,
    shuffle: context.query.shuffle === 'true',
    id: context.query.id === undefined ? -1 : Number(context.query.id),
  };
  // 特定のタグを解くのであれば
  if (context.query.tag) {
    let filter: string = '';
    if (Array.isArray(context.query.tag)) filter = context.query.tag[0];
    else filter = context.query.tag;
    props.tag_filter = filter;

    const data: Categoly = {
      title: `タグ(${filter})`,
      version: 2,
      description: '',
      tag: [],
      list: '[]',
    };

    props.data.forEach(e => {
      let tag_included = false;
      // タグが含まれているかどうかをチェック
      e.tag.forEach(tag => {
        if (tag_included) return;
        tag_included = tag.name === filter;
      });
      // タグが含まれているカテゴリであれば、問題を追加
      if (tag_included) {
        const data_list = JSON.parse(data.list);
        const elem_list = JSON.parse(e.list);
        data.list = JSON.stringify(data_list.concat(elem_list));
      }
    });

    props.data = [data];
  }
  return {props: props};
};
