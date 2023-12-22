// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import {Edit} from '@/pages/edit';
import React from 'react';
import Loading from '@/common/Loading/Loading';
import {useCategoryData} from '@utils/api/category';
import {useTagData} from '@utils/api/tag';
import {useSearchParams} from 'next/navigation';

export default function EditPage(): React.ReactElement {
  const search_params = useSearchParams();
  const id = search_params?.get('id');
  const [categoly, isCategolyLoading] = useCategoryData(id ?? '');
  const [tags, isTagLoading] = useTagData();

  return isTagLoading || isCategolyLoading ? <Loading /> : <Edit data={categoly} tags={tags} />;
}
