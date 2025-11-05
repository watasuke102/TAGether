// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import { mutate } from 'swr';
import { fetcher, useApiData } from './common';
import FeatureRequest from '@mytypes/FeatureRequest';

const request_key = '/api/request';

export const mutate_request = (): Promise<void> => mutate(request_key);
export const useRequestData = useApiData<FeatureRequest[]>(request_key);

export async function new_request(body: string): Promise<void> {
  await fetcher(request_key, { method: 'POST', body });
  mutate_request();
}

export async function set_answer_to_request(id: number | string, answer: string): Promise<void> {
  await fetcher(`${request_key}/${id}`, { method: 'PUT', body: answer });
  mutate_request();
}
