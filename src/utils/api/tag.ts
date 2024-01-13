// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {mutate} from 'swr';
import axios, {AxiosPromise} from 'axios';
import {fetcher, useApiData} from './common';
import TagData from '@mytypes/TagData';
import {PutTag} from 'src/app/api/tag/[id]/route';
import {PostTag} from 'src/app/api/tag/route';

export const tag_key = '/api/tag';

export const mutate_tag = (): Promise<void> => mutate(tag_key);
export const useTagData = useApiData<TagData[]>(tag_key);
export function fetch_tag(): Promise<TagData[]> {
  return fetcher(`http://localhost:3009${tag_key}`);
}

export async function new_tag(data: PostTag): Promise<AxiosPromise> {
  return axios.post(tag_key, JSON.stringify(data), {headers: {'Content-Type': 'application/json'}});
}

export async function update_tag(id: number | string, data: PutTag): Promise<AxiosPromise> {
  return axios.put(`${tag_key}/${id}`, JSON.stringify(data), {headers: {'Content-Type': 'application/json'}});
}
