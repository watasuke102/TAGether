// TAGether - Share self-made exam for classmates
// create.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import {Create} from '@/pages/create';
import React from 'react';
import Loading from '@/common/Loading/Loading';
import {useCategolyData, useTagData} from '@/utils/Api';

export default function EditPage(): React.ReactElement {
  // クエリパラメータでcategoly[0]に編集したいカテゴリがあるはず
  const [categoly, isCategolyLoading] = useCategolyData();
  const [tags, isTagLoading] = useTagData();

  React.useEffect(() => {
    console.log(isCategolyLoading, categoly, isTagLoading, tags);
  });

  return isTagLoading || isCategolyLoading ? <Loading /> : <Create mode={'edit'} data={categoly[0]} tags={tags} />;
}
