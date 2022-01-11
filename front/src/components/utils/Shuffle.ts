// TAGether - Share self-made data for classmates
// Shuffle.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
export function Shuffle<T>(e: Array<T>): Array<T> {
  // 引数なしconcatで深いコピー
  const data = e.concat();
  for (let i = data.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    const tmp = data[i];
    data[i] = data[r];
    data[r] = tmp;
  }
  return data;
}
