// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import useMutSWR from 'swr';

export const fetcher = (url: string, ...args) => fetch(url, ...args).then(res => res.json());
export function useApiData<T>(key: string): () => [T[], boolean, boolean] {
  return () => {
    const {data, isLoading, error} = useMutSWR(key, fetcher);
    return [data, isLoading, !!error];
  };
}
