// TAGether - Share self-made data for classmates
// Shuffle.ts
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//

// Fisher–Yates法によって配列をシャッフルして返す
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

// from番目の要素をto番目に持ってくる
// ex: Move([1, 2, 3, 4, 5], 0, 4) => [2, 3, 4, 5, 1]
export function Move<T>(e: Array<T>, from: number, to: number): Array<T> {
  if (from === to) return e;
  const data = e.concat();
  data.splice(to + (from < to ? 1 : 0), 0, data[from]);
  data.splice(from + (from > to ? 1 : 0), 1);
  return data;
}
