// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {expect, test} from 'vitest';
import {StateType, edit_reducer} from 'src/app/edit/_components/EditReducer';
import {exam_default} from 'src/utils/DefaultValue';
import ExamType from 'src/types/ExamType';

const initial_exam = new Array(10).fill(exam_default()[0]);
const initial_state: StateType = {
  current_editing: 5,
  title: 'title',
  desc: 'description',
  list: JSON.stringify(initial_exam),
  exam: initial_exam,
};

const dup = (o: object) => JSON.parse(JSON.stringify(o));

test('title/setのとき、titleが渡した文字列で置き換えられる', () => {
  const new_title = 'new title';
  expect(edit_reducer(dup(initial_state), {type: 'title/set', data: new_title}).title).toBe(new_title);
});
test('desc/setのとき、descが渡した文字列で置き換えられる', () => {
  const new_desc = 'new description';
  expect(edit_reducer(dup(initial_state), {type: 'desc/set', data: new_desc}).desc).toBe(new_desc);
});
test('list/setのとき、listが渡した文字列で置き換えられる', () => {
  const new_desc = 'new description';
  expect(edit_reducer(dup(initial_state), {type: 'desc/set', data: new_desc}).desc).toBe(new_desc);
});

test('q:question/setのとき、current_editing番目のExamが持つquestionが、渡した文字列で置き換えられる', () => {
  const new_question = 'new question';
  expect(
    edit_reducer(dup(initial_state), {type: 'q:question/set', data: new_question}).exam[initial_state.current_editing]
      .question,
  ).toBe(new_question);
});
test('q:comment/setのとき、current_editing番目のExamが持つcommentが、渡した文字列で置き換えられる', () => {
  const new_comment = 'new comment';
  expect(
    edit_reducer(dup(initial_state), {type: 'q:comment/set', data: new_comment}).exam[initial_state.current_editing]
      .comment,
  ).toBe(new_comment);
});
test('q:type/setのとき、current_editing番目のExamのtypeが、渡したExamTypeで置き換えられる', () => {
  const new_type: ExamType = 'MultiSelect';
  expect(
    edit_reducer(dup(initial_state), {type: 'q:type/set', to: new_type}).exam[initial_state.current_editing].type,
  ).toBe(new_type);
});

test('index/jumpを行うと、current_editingが渡した値になる', () => {
  const jump_to = 1;
  expect(edit_reducer(dup(initial_state), {type: 'index/jump', at: jump_to}).current_editing).toBe(jump_to);
});

test('index/jumpを行うと、current_editingが渡した値になる', () => {
  const jump_to = 1;
  expect(edit_reducer(dup(initial_state), {type: 'index/jump', at: jump_to}).current_editing).toBe(jump_to);
});
test('index/jumpに負の数を渡すと、current_editingが0となる', () => {
  const jump_to = -1;
  expect(jump_to).toBeLessThan(0);
  expect(edit_reducer(dup(initial_state), {type: 'index/jump', at: jump_to}).current_editing).toBe(0);
});
test('index/jumpにexam.length以上の値を渡すと、current_editingがexam.length-1となる', () => {
  expect(edit_reducer(dup(initial_state), {type: 'index/jump', at: initial_state.exam.length}).current_editing).toBe(
    initial_state.exam.length - 1,
  );
  const gt_length = 100;
  expect(gt_length).toBeGreaterThanOrEqual(initial_state.exam.length);
  expect(edit_reducer(dup(initial_state), {type: 'index/jump', at: gt_length}).current_editing).toBe(
    initial_state.exam.length - 1,
  );
});
test('index/firstを行うと、current_editingが0になる', () => {
  expect(initial_state.current_editing).not.toBe(0);
  expect(edit_reducer(dup(initial_state), {type: 'index/first'}).current_editing).toBe(0);
});
test('current_editingが0より大きい時にindex/prevを行うと、current_editingが1減少する', () => {
  expect(initial_state.current_editing).toBeGreaterThan(0);
  expect(edit_reducer(dup(initial_state), {type: 'index/prev'}).current_editing).toBe(
    initial_state.current_editing - 1,
  );
});
test('current_editingがexam.length-1より小さい時にindex/nextを行うと、current_editingが1増加する', () => {
  expect(initial_state.current_editing).toBeLessThan(initial_state.exam.length - 1);
  expect(edit_reducer(dup(initial_state), {type: 'index/prev'}).current_editing).toBe(
    initial_state.current_editing + 1,
  );
});
test('index/lastを行うと、current_editingがexam.length-1になる', () => {
  expect(initial_state.current_editing).not.toBe(initial_state.exam.length - 1);
  expect(edit_reducer(dup(initial_state), {type: 'index/last'}).current_editing).toBe(initial_state.exam.length - 1);
});
