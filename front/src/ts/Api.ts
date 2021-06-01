// TAGether - Share self-made exam for classmates
// Api.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//

import Categoly from '../types/Categoly';

type Query = string | string[] | undefined;

export async function GetCategoly(query: Query): Promise<Categoly[]> {
  console.log(query);
  // 渡されたURLクエリ (context.query.id) からidを取得
  let id: string;
  if (Array.isArray(query)) id = query[0];
  else id = query ?? '';
  // APIでカテゴリを取得する
  let data: Categoly[];
  try {
    const res = await fetch(`${process.env.GET_URL ?? ''}/categoly/${id ?? ''}`);
    data = await res.json();
  } catch {
    data = [];
  }
  return data;
}
