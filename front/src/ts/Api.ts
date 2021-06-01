// TAGether - Share self-made exam for classmates
// Api.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import ApiResponse from '../types/ApiResponse';

type Query = string | string[] | undefined;

export default async function GetFromApi<T>(query: Query): Promise<T[]> {
  // 渡されたURLクエリ (context.query.id) からidを取得
  let id: string;
  if (Array.isArray(query)) id = query[0];
  else id = query ?? '';
  // APIでカテゴリを取得する
  let data: ApiResponse = {
    isSuccess: false, result: []
  };
  try {
    const res = await fetch(`${process.env.GET_URL ?? ''}/categoly/${id ?? ''}`);
    data = await res.json();
  } catch {
    data.result = [];
  }
  if (data.isSuccess && Array.isArray(data.result))
    return data.result;
  else return [];
}
