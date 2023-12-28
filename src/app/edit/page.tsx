// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import React from 'react';
import {EditPage} from './_components/EditPage/EditPage';
import {fetcher} from '@utils/api/common';

type Props = {
  searchParams: {
    id?: string;
  };
};

export default async function Edit(props: Props): Promise<JSX.Element> {
  if (!props.searchParams.id) {
    throw Error('id is not specified');
  }
  const category = await fetcher(`http://localhost:3009/api/category/${props.searchParams.id}`);
  const tags = await fetcher('http://localhost:3009/api/tag');
  return <EditPage category={category[0]} tags={tags} />;
}
