// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {mutate} from 'swr';
import useImmSWR from 'swr/immutable';
import axios, {AxiosPromise} from 'axios';
import {fetcher, useApiData} from './common';
import {AllCategoryDataType, CategoryDataType} from '@mytypes/Categoly';
import {NewCategory} from 'src/app/api/category/route';
import {PutCategory} from 'src/app/api/category/[id]/route';

const category_key = '/api/category';

export const mutate_category = (): Promise<void> => mutate(category_key);
export const useAllCategoryData = useApiData<AllCategoryDataType>(category_key);
export function useCategoryData(id: number | string): [CategoryDataType, boolean, boolean] {
  const {data, isLoading, error} = useImmSWR(`${category_key}/${id}`, fetcher);
  return [data?.at(0), isLoading, !!error];
}

export async function new_category(data: NewCategory): Promise<AxiosPromise> {
  return axios.post(category_key, JSON.stringify(data), {headers: {'Content-Type': 'application/json'}});
}

export async function update_category(id: number | string, data: PutCategory): Promise<AxiosPromise> {
  return axios.put(`${category_key}/${id}`, JSON.stringify(data), {headers: {'Content-Type': 'application/json'}});
}

export async function toggle_delete_category(id: number | string): Promise<AxiosPromise> {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  return axios.delete(`${category_key}/${id}`);
}
