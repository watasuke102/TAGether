// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import useImmSWR from 'swr/immutable';
import {CategoryDataType} from '@mytypes/Category';
import {fetcher} from './common';
import {category_key} from './category';

// utils/api/category.tsに配置するとserver clientからimportしたときにエラーとなるから
export function useCategoryData(id: number | string): [CategoryDataType, boolean, boolean] {
  const {data, isLoading, error} = useImmSWR(`${category_key}/${id}`, fetcher);
  return [data, isLoading, !!error];
}
