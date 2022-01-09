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
import {useTagData} from '@/utils/Api';
import {categoly_default} from '@/utils/DefaultValue';

export default function CreatePage(): React.ReactElement {
  const [tags, isLoading] = useTagData();

  return isLoading ? <Loading /> : <Create mode={'create'} data={categoly_default()} tags={tags} />;
}
