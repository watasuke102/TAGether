// TAGether - Share self-made exam for classmates
// request.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react';
import {GetServerSideProps} from 'next';
import {Request} from '@/pages/request';
import GetFromApi from '@/utils/Api';
import FeatureRequest from '@mytypes/FeatureRequest';

interface Props {
  requests: FeatureRequest[];
}

export default function RequestPage(props: Props): React.ReactElement {
  return <Request {...props} />;
}

export const getServerSideProps: GetServerSideProps = async context => {
  const data = await GetFromApi<FeatureRequest>('request', context.query.id);
  data.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  return {props: {requests: data}};
};
