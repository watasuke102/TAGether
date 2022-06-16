// TAGether - Share self-made exam for classmates
// create.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import {Edit} from '@/pages/edit';
import React from 'react';
import Loading from '@/common/Loading/Loading';
import {useCategolyData, useTagData} from '@/utils/Api';

export default function EditPage(): React.ReactElement {
  // クエリパラメータでcategoly[0]に編集したいカテゴリがあるはず
  const [categoly, isCategolyLoading] = useCategolyData();
  const [tags, isTagLoading] = useTagData();

  return isTagLoading || isCategolyLoading ? <Loading /> : <Edit data={categoly[0]} tags={tags} />;
}
