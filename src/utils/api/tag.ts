// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {mutate} from 'swr';
import TagData from '@mytypes/TagData';
import {PutTag} from 'src/app/api/tag/[id]/route';
import {PostTag} from 'src/app/api/tag/route';
import {env} from 'env';
import {fetcher, useApiData} from './common';

export const tag_key = '/api/tag';

export const mutate_tag = (): Promise<void> => mutate(tag_key);
export function useTagData() {
  return useApiData<TagData[]>(tag_key);
}
export function fetch_tag(): Promise<TagData[]> {
  return fetcher(env.API_URL + tag_key);
}

export async function new_tag(data: PostTag): Promise<{inserted_id: number}> {
  return fetcher(`${env.API_URL}${tag_key}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
  });
}

export async function update_tag(id: number | string, data: PutTag): Promise<void> {
  return fetcher(`${env.API_URL}${tag_key}/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
  });
}
