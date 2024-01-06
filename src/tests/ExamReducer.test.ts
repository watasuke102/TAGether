// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {describe, expect, test} from 'vitest';
import {StateType, exam_reducer, init_state} from 'src/app/exam/_components/ExamReducer';

const initial_state = init_state([
  {type: 'Text', question: 'Aが正解', answer: ['A']},
  {type: 'Select', question: 'Aが正解', answer: ['0'], question_choices: ['A', 'B', 'C']},
  {type: 'MultiSelect', question: 'A以外が正解', answer: ['1', '2'], question_choices: ['A', 'B', 'C']},
  {type: 'Sort', question: 'ABCD', answer: ['A', 'B', 'C', 'D']},
]);
const dup = (o: object) => JSON.parse(JSON.stringify(o));

test('text/setのとき、indexに対応するexam_stateのuser_answerにおいて、指定された位置の要素が渡された文字列になる', () => {
  const data = 'user input';
  const at = 0;
  const changed = exam_reducer(dup(initial_state), {type: 'text/set', at, data});
  expect(changed.exam_state[changed.index].user_answer[at]).toBe(data);
});
test('select/setのとき、indexに対応するexam_stateのuser_answerが、渡されたindexを唯一の要素とする配列になる', () => {
  const index = 2;
  expect(
    exam_reducer(dup(initial_state), {type: 'select/set', index}).exam_state[initial_state.index].user_answer,
  ).toStrictEqual([String(index)]);
});
describe('multi/toggle', () => {
  const index = 2;
  const first = exam_reducer(dup(initial_state), {type: 'multi/toggle', index});
  test('渡されたindexが配列内に存在しないとき、文字列を要素として加える', () => {
    expect(initial_state.exam_state[initial_state.index].user_answer.indexOf(String(index))).toBe(-1);
    expect(first.exam_state[first.index].user_answer.indexOf(String(index))).not.toBe(-1);
  });
  test('渡されたindexが配列内に存在する場合、その要素を取り除く', () => {
    const second = exam_reducer(dup(first), {type: 'multi/toggle', index});
    expect(second.exam_state[second.index].user_answer.indexOf(String(index))).toBe(-1);
  });
});
test('sort/moveのとき、examにおいて、fromに指定した位置の要素がtoに移動する', () => {
  const init = {...initial_state, index: 3};
  expect(init.exam[init.index].type).toBe('Sort');
  const from = 0;
  const to = 1;
  expect(init.exam[from]).not.toStrictEqual(init.exam[to]);
  const moved = exam_reducer(dup(init), {type: 'sort/move', from, to});
  expect(moved.exam_state[moved.index].user_answer[to]).toStrictEqual(init.exam[from]);
});

describe('index/set', () => {
  test('0未満の値が渡されたとき、indexを変更しない', () => {
    expect(exam_reducer(dup(initial_state), {type: 'index/set', index: -1}).index).toBe(initial_state.index);
  });
  test('exam_length以上の値が渡されたとき、indexを変更しない', () => {
    expect(exam_reducer(dup(initial_state), {type: 'index/set', index: initial_state.exam.length}).index).toBe(
      initial_state.index,
    );
  });
  const index = 2;
  test('範囲内の値が渡された場合、indexをそれに設定する', () => {
    expect(exam_reducer(dup(initial_state), {type: 'index/set', index}).index).toBe(index);
  });
});
describe('handle_button/prev', () => {
  const init: StateType = {
    ...initial_state,
    index: 1,
  };
  const first = exam_reducer(dup(init), {type: 'handle_button/prev'});
  test('indexが0より大きければデクリメント', () => {
    expect(init.index).toBeGreaterThan(0);
    expect(first.index).toBe(init.index - 1);
  });
  test('indexが0であれば変化なし', () => {
    expect(first.index).toBe(0);
    expect(exam_reducer(dup(first), {type: 'handle_button/prev'}).index).toBe(init.index - 1);
  });
});

describe('handle_button/next', () => {
  const init = init_state([
    {type: 'Text', question: 'Aが正解', answer: ['A']},
    {type: 'Text', question: 'Aが正解', answer: ['A']},
  ]);
  const first = exam_reducer(dup(init), {type: 'handle_button/next'});
  test('indexに対応するexam_stateのcheckedがfalseであれば（答え合わせをして）checkedをtrueにする', () => {
    expect(init.exam_state[init.index].checked).toBe(false);
    expect(first.exam_state[first.index].checked).toBe(true);
  });
  const second = exam_reducer(dup(first), {type: 'handle_button/next'});
  test('indexに対応するexam_stateのcheckedがtrueかつindexがexam.len-1より小さければindexをインクリメント', () => {
    expect(first.index).toBeLessThan(first.exam.length - 1);
    expect(second.index).toBe(first.index + 1);
  });
});
