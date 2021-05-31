// TAGether - Share self-made exam for classmates
// SqlManager.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//

import Categoly from '../types/Categoly';

export async function GetExam(id?: number): Promise<Categoly[]> {
  let query: string = '';
  if (id) {
    query = '?id=' + id;
  }
  let data: Categoly[];
  try {
    const res = await fetch('http://nginx' + query);
    data = await res.json();
  } catch {
    data = [];
  }
  return data;
}
