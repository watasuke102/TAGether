// TAGether - Share self-made exam for classmates
// GenerateList.ts
//
// CopyRight (c) 2020 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import Categoly from '../types/categoly'

export default function GenerateList(json: string) {
  const categoly: Categoly[] = JSON.parse(json);
  return categoly;
}