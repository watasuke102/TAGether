// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {mutate} from 'swr';
import {AllCategoryDataType, CategoryDataType} from '@mytypes/Category';
import {NewCategory} from 'src/app/api/category/route';
import {PutCategory} from 'src/app/api/category/[id]/route';
import {env} from 'env';
import {tag_key} from './tag';
import {fetcher, useApiData} from './common';

export const category_key = '/api/category';

export const mutate_category = (): Promise<void> => mutate(category_key);
export function useAllCategoryData() {
  return useApiData<AllCategoryDataType[]>(category_key);
}

export function fetch_category_data(id: number | string): Promise<CategoryDataType> {
  return fetcher(`${env.API_URL}${category_key}/${id}`);
}
// 特定のタグが付けられているすべてのカテゴリ
export function fetch_category_with_spec_tag_data(tag_id: number | string): Promise<CategoryDataType> {
  return fetcher(`${env.API_URL}${tag_key}/${tag_id}/all_category`);
}

export async function new_category(data: NewCategory): Promise<{inserted_id: number}> {
  return fetcher(`${env.API_URL}${category_key}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
  });
}

export async function update_category(id: number | string, data: PutCategory): Promise<{inserted_id: number}> {
  return fetcher(`${env.API_URL}${category_key}/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
  });
}

export async function toggle_delete_category(id: number | string): Promise<{inserted_id: number}> {
  return fetcher(`${env.API_URL}${category_key}/${id}`, {
    method: 'delete',
  });
}
