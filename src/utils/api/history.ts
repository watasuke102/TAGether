// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {mutate} from 'swr';
import {AllHistory, History} from '@mytypes/ExamHistory';
import {NewHistory} from 'src/app/api/history/route';
import {env} from 'env';
import {fetcher, useApiData} from './common';

export const history_key = '/api/history';

export const mutate_history = (): Promise<void> => mutate(history_key);
export function useAllHistory() {
  return useApiData<AllHistory[]>(history_key);
}

export function fetch_history(id: string): Promise<History> {
  return fetcher(`${env.API_URL}${history_key}/${id}`);
}

export async function new_history(data: NewHistory): Promise<{inserted_id: string}> {
  return fetcher(`${env.API_URL}${history_key}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
  });
}

export async function delete_history(id: string): Promise<void> {
  await fetcher(`${history_key}/${id}`, {method: 'DELETE'});
  mutate_history();
}
