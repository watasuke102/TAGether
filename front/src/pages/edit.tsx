// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {Edit} from '@/pages/edit';
import React from 'react';
import Loading from '@/common/Loading/Loading';
import {useCategolyData, useTagData} from '@/utils/Api';

export default function EditPage(): React.ReactElement {
  // クエリパラメータでcategoly[0]に編集したいカテゴリがあるはず
  const [categoly, isCategolyLoading] = useCategolyData(false);
  const [tags, isTagLoading] = useTagData();

  return isTagLoading || isCategolyLoading ? <Loading /> : <Edit data={categoly[0]} tags={tags} />;
}
