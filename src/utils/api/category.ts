// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {mutate} from 'swr';
import axios, {AxiosPromise} from 'axios';
import {fetcher, useApiData} from './common';
import {AllCategoryDataType, CategoryDataType} from '@mytypes/Category';
import {NewCategory} from 'src/app/api/category/route';
import {PutCategory} from 'src/app/api/category/[id]/route';
import {tag_key} from './tag';

export const category_key = '/api/category';

export const mutate_category = (): Promise<void> => mutate(category_key);
export const useAllCategoryData = useApiData<AllCategoryDataType[]>(category_key);

export function fetch_category_data(id: number | string): Promise<CategoryDataType> {
  return fetcher(`http://localhost:3009${category_key}/${id}`);
}
// 特定のタグが付けられているすべてのカテゴリ
export function fetch_category_with_spec_tag_data(tag_id: number | string): Promise<CategoryDataType> {
  return fetcher(`http://localhost:3009${tag_key}/${tag_id}/all_category`);
}

export async function new_category(data: NewCategory): AxiosPromise {
  return axios.post(category_key, JSON.stringify(data), {headers: {'Content-Type': 'application/json'}});
}

export async function update_category(id: number | string, data: PutCategory): Promise<AxiosPromise> {
  return axios.put(`${category_key}/${id}`, JSON.stringify(data), {headers: {'Content-Type': 'application/json'}});
}

export async function toggle_delete_category(id: number | string): Promise<AxiosPromise> {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  return axios.delete(`${category_key}/${id}`);
}
