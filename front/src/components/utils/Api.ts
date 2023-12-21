// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import Categoly from '@mytypes/Categoly';
import FeatureRequest from '@mytypes/FeatureRequest';
import TagData from '@mytypes/TagData';
import useMutSWR from 'swr';
import useSWR from 'swr/immutable';

const fetcher = (url: string, ...args) => fetch(url, ...args).then(res => res.json());

function useApiData<T>(key: string): () => [T[], boolean, boolean] {
  return () => {
    const {data, isLoading, error} = useMutSWR(key, fetcher);
    return [data, isLoading, !!error];
  };
}

export const useRequestData = useApiData<FeatureRequest>('/api/request');
export const useTagData = useApiData<TagData>('/api/tag');
export const useAllCategoryData = useApiData<Categoly>('/api/category');

export function useCategoryData(id: number | string): [Categoly, boolean, boolean] {
  const {data, isLoading, error} = useSWR(`/api/category/${id}`, fetcher);
  return [data?.at(0), isLoading, !!error];
}

export async function GetFromApi<T>(target: string, id?: string, parameter?: string): Promise<T[]> {
  // 渡されたURLクエリ (context.query.id) からidを取得
  // APIでカテゴリを取得する
  let data: T[] = [];
  try {
    data = await (await fetch(`${process.env.API_URL ?? ''}/${target}/${id ?? ''}${parameter ?? ''}`)).json();
  } catch {
    data = [];
  }
  // 取得したデータを返す
  return Array.isArray(data) && data.length > 0 ? data : [];
}
