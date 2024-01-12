// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {describe, expect, test} from 'vitest';
import {Move, Swap, ToggleElement} from '../utils/ArrayUtil';

describe('Move', () => {
  const array = [1, 2, 3, 4, 5];
  const changed = Move(array, 0, 4);
  test('要素が移動している', () => expect(changed).toStrictEqual([2, 3, 4, 5, 1]));
  test('元の配列は不変である', () => expect(array).toStrictEqual([1, 2, 3, 4, 5]));
});

describe('Swap', () => {
  const array = [1, 2, 3, 4, 5];
  const changed = Swap(array, 0, 4);
  test('要素が入れ替わっている', () => expect(changed).toStrictEqual([5, 2, 3, 4, 1]));
  test('元の配列は不変である', () => expect(array).toStrictEqual([1, 2, 3, 4, 5]));
});

describe('ToggleElement', () => {
  const array = [1, 2, 3];
  const first = ToggleElement(array, 4);
  test('配列に含まれない要素を渡すと、その要素を含む配列が返される', () => {
    expect(array.indexOf(4)).toBe(-1);
    expect(first).toStrictEqual([1, 2, 3, 4]);
  });
  test('元の配列は不変である', () => expect(array).toStrictEqual([1, 2, 3]));
  const second = ToggleElement(first, 4);
  test('配列に含まれる要素を渡すと、その要素を含まない配列が返される', () => {
    expect(first.indexOf(4)).not.toBe(-1);
    expect(second).toStrictEqual([1, 2, 3]);
  });
});
