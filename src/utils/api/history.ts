// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {mutate} from 'swr';
import axios, {AxiosPromise} from 'axios';
import {fetcher, useApiData} from './common';
import {AllHistory, History} from '@mytypes/ExamHistory';
import {NewHistory} from 'src/app/api/history/route';
import {env} from 'env';

export const history_key = '/api/history';

export const mutate_history = (): Promise<void> => mutate(history_key);
export const useAllHistory = useApiData<AllHistory[]>(history_key);

export function fetch_history(id: string): Promise<History> {
  return fetcher(`${env.API_URL}${history_key}/${id}`);
}

export async function new_history(data: NewHistory): AxiosPromise {
  return axios.post(history_key, JSON.stringify(data), {headers: {'Content-Type': 'application/json'}});
}

export async function delete_history(id: string): Promise<void> {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await axios.delete(`${history_key}/${id}`);
  mutate_history();
}
