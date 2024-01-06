// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.

/// Fisher–Yates法によって配列をシャッフルして返す
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

/// from番目の要素をto番目に持ってくる
/// ex: Move([1, 2, 3, 4, 5], 0, 4) => [2, 3, 4, 5, 1]
export function Move<T>(e: Array<T>, from: number, to: number): Array<T> {
  if (from === to) return e;
  const data = e.concat();
  data.splice(to + (from < to ? 1 : 0), 0, data[from]);
  data.splice(from + (from > to ? 1 : 0), 1);
  return data;
}

/// i番目の要素とj番目の要素を入れ替え
/// ex: Move([1, 2, 3, 4, 5], 0, 4) => [5, 2, 3, 4, 1]
export function Swap<T>(e: Array<T>, i: number, j: number): Array<T> {
  if (i === j) return e;
  const data = e.concat();
  const tmp = data[i];
  data[i] = data[j];
  data[j] = tmp;
  return data;
}

/// 渡された要素が配列に含まれる時：その要素を含まない配列を返す
/// 渡された要素が配列に含まれない時：その要素を含む配列を返す
export function ToggleElement<T>(e: Array<T>, data: T): Array<T> {
  const array = e.concat();
  const index = array.indexOf(data);
  if (index === -1) {
    array.push(data);
  } else {
    array.splice(index, 1);
  }
  return array;
}
