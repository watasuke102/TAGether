// TAGether - Share self-made exam for classmates
// examtable.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react';
import {GetServerSideProps} from 'next';
import {ExamTable} from '@/pages/examtable';
import GetFromApi from '@/utils/Api';
import Categoly from '@mytypes/Categoly';

interface Props {
  data: Categoly[];
  shuffle: boolean;
}

export default function ExamTablePage(props: Props): React.ReactElement {
  return <ExamTable {...props} />;
}

export const getServerSideProps: GetServerSideProps = async context => {
  const data = await GetFromApi<Categoly>('categoly', context.query.id);
  const props: Props = {
    data: data,
    shuffle: context.query.shuffle === 'true',
  };
  return {props: props};
};
