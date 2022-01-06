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
import {Profile} from '@/pages/profile';
import GetFromApi from '@/utils/Api';
import Categoly from 'types/Categoly';

interface Props {
  data: Categoly[];
}

export default function ProfilePage(props: Props): React.ReactElement {
  return <Profile {...props} />;
}

export const getServerSideProps: GetServerSideProps = async context => {
  const data = await GetFromApi<Categoly>('categoly', context.query.id);
  return {props: {data: data}};
};
