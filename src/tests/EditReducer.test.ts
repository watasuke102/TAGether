// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {describe, expect, test} from 'vitest';
import {StateType, edit_reducer} from 'src/app/edit/_components/EditReducer';
import ExamType from 'src/types/ExamType';
import Exam from '@mytypes/Exam';
import TagData from '@mytypes/TagData';

const initial_state: StateType = (() => {
  const initial_exam: Exam[] = [...Array(10)].map((_, i) => {
    return {
      type: 'Text',
      question: `question ${i}`,
      answer: [`${i}_answer 0`, `${i}_answer 1`],
      question_choices: [`${i}_choice 0`, `${i}_choice 1`],
    };
  });
  return {
    current_editing: 5,
    title: 'title',
    desc: 'description',
    list: JSON.stringify(initial_exam),
    exam: initial_exam,
    tags: [],
  };
})();
const empty_exam: Exam = {
  type: 'Text',
  question: '',
  question_choices: [''],
  answer: [''],
  comment: '',
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
test('tags/setのとき、tagsが渡したTagDataで置き換えられる', () => {
  const new_tag: TagData[] = [{name: 'new tag', description: 'desc', updated_at: ''}];
  expect(edit_reducer(dup(initial_state), {type: 'tags/set', data: new_tag}).tags).toStrictEqual(new_tag);
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
    edit_reducer(dup(initial_state), {type: 'q:type/set', data: new_type}).exam[initial_state.current_editing].type,
  ).toBe(new_type);
});

test('q:answer/set_singleのとき、current_editing番目のExamのanswerが、渡されたchoiceのindexを唯一の要素とする配列になる', () => {
  const index = 2;
  expect(
    edit_reducer(dup(initial_state), {type: 'q:answer/set_single', index}).exam[initial_state.current_editing].answer,
  ).toStrictEqual([String(index)]);
});

describe('q:answer/toggle_multiのとき、current_editing番目のExamのanswerが編集される', () => {
  const initial: StateType = {
    ...initial_state,
    current_editing: 0,
    exam: [empty_exam],
  };
  const index = 2;
  const first = edit_reducer(dup(initial), {type: 'q:answer/toggle_multi', index});
  test('渡されたchoiceのindexが配列内に存在しないとき、文字列を要素として加える', () => {
    expect(initial.exam[0].answer.indexOf(String(index))).toBe(-1);
    expect(first.exam[0].answer.indexOf(String(index))).not.toBe(-1);
  });
  test('渡されたchoiceのindexが配列内に存在する場合、その要素を取り除く', () => {
    const second = edit_reducer(dup(first), {type: 'q:answer/toggle_multi', index});
    expect(second.exam[0].answer.indexOf(String(index))).toBe(-1);
  });
});

test('q:choice/setのとき、current_editing番目Examのchoiceのうちindex番目が、渡した文字列で置き換えられる', () => {
  const new_choice = 'new choice';
  for (let i = 2; i >= 0; --i) {
    expect(
      edit_reducer(dup(initial_state), {type: 'q:choice/set', index: i, data: new_choice}).exam[
        initial_state.current_editing
      ].question_choices?.at(i),
    ).toBe(new_choice);
  }
});
test('q:choice/setのとき、current_editing番目Examのanswerのうちindex番目が、渡した文字列で置き換えられる', () => {
  const new_answer = 'new answer';
  for (let i = 2; i >= 0; --i) {
    expect(
      edit_reducer(dup(initial_state), {type: 'q:answer/set', index: i, data: new_answer}).exam[
        initial_state.current_editing
      ].answer?.at(i),
    ).toBe(new_answer);
  }
});

test('exam/moveのとき、examにおいて、fromに指定した位置の要素がtoに移動する', () => {
  const from = 0;
  const to = 1;
  expect(initial_state.exam[from]).not.toStrictEqual(initial_state.exam[to]);
  const swapped = edit_reducer(dup(initial_state), {type: 'exam/move', from, to});
  expect(swapped.exam.length).toStrictEqual(initial_state.exam.length);
  expect(swapped.exam[to]).toStrictEqual(initial_state.exam[from]);
});
test('q:answer/moveのとき、current_editing番目Examのanswerにおいて、fromに指定した位置の要素がtoに移動する', () => {
  const from = 0;
  const to = 1;
  expect(initial_state.exam[from]).not.toStrictEqual(initial_state.exam[to]);
  const swapped = edit_reducer(dup(initial_state), {type: 'q:answer/move', from, to});
  expect(swapped.current_editing).toBe(initial_state.current_editing);
  expect(swapped.exam[swapped.current_editing].answer.length).toBe(
    initial_state.exam[initial_state.current_editing].answer.length,
  );
  expect(swapped.exam[swapped.current_editing].answer[to]).toBe(
    initial_state.exam[initial_state.current_editing].answer[from],
  );
});
test('q:choice/moveのとき、current_editing番目Examのchoiceにおいて、fromに指定した位置の要素がtoに移動する', () => {
  const from = 0;
  const to = 1;
  expect(initial_state.exam[from]).not.toStrictEqual(initial_state.exam[to]);
  const swapped = edit_reducer(dup(initial_state), {type: 'q:choice/move', from, to});
  expect(swapped.current_editing).toBe(initial_state.current_editing);
  expect((swapped.exam[swapped.current_editing].question_choices ?? []).length).toBe(
    (initial_state.exam[initial_state.current_editing].question_choices ?? []).length,
  );
  expect(swapped.exam[swapped.current_editing].question_choices?.at(to)).toBe(
    initial_state.exam[initial_state.current_editing].question_choices?.at(from),
  );
});

describe('exam/insertによって空の問題が挿入される', () => {
  [-1, 1, initial_state.exam.length].forEach(at => {
    const inserted = edit_reducer(dup(initial_state), {type: 'exam/insert', at});
    test('exam.lengthが増加する', () => {
      expect(inserted.exam.length).toBe(initial_state.exam.length + 1);
    });
    if (at < 0) {
      test('場所として負の数を渡すと、先頭に空の問題が挿入される', () => {
        expect(inserted.exam[0]).not.toStrictEqual(initial_state.exam[0]);
        expect(inserted.exam[0]).toStrictEqual(empty_exam);
      });
    } else if (at > initial_state.exam.length - 1) {
      test('場所としてexam.lengthより大きい数を渡すと、末尾に空の問題が挿入される', () => {
        expect(inserted.exam[inserted.exam.length - 1]).not.toStrictEqual(
          initial_state.exam[initial_state.exam.length - 1],
        );
        expect(inserted.exam[inserted.exam.length - 1]).toStrictEqual(empty_exam);
      });
    } else {
      test('場所としてexamの範囲内の場所を指定した際、その場所に空の問題が挿入される', () => {
        expect(inserted.exam[at]).not.toStrictEqual(initial_state.exam[at]);
        expect(inserted.exam[at]).toStrictEqual(empty_exam);
      });
    }
  });
});
describe('exam/removeによって問題が削除される', () => {
  [-1, 1, initial_state.exam.length].forEach(at => {
    const inserted = edit_reducer(dup(initial_state), {type: 'exam/remove', at});
    test(`exam.lengthが減少する (at: ${at})`, () => {
      expect(inserted.exam.length).toBe(initial_state.exam.length - 1);
    });
    if (at < 0) {
      test('場所として負の数を渡すと、先頭が削除される', () => {
        expect(inserted.exam[0]).not.toStrictEqual(initial_state.exam[0]);
      });
    } else if (at > initial_state.exam.length - 1) {
      test('場所としてexam.lengthより大きい数を渡すと、末尾が削除される', () => {
        expect(inserted.exam[inserted.exam.length - 1]).not.toStrictEqual(
          initial_state.exam[initial_state.exam.length - 1],
        );
      });
    } else {
      test('場所としてexamの範囲内の場所を指定した際、その場所が削除される', () => {
        expect(inserted.exam[at]).not.toStrictEqual(initial_state.exam[at]);
      });
    }
  });
});
test('exam/removeによってexamの要素数は0にならない', () => {
  const initial: StateType = {
    ...initial_state,
    list: '',
    exam: [empty_exam],
  };
  expect(initial.exam.length).toBe(1);
  expect(edit_reducer(dup(initial), {type: 'exam/remove', at: 0}).exam.length).toBe(initial.exam.length);
});

describe('q:answer/insertによって空のanswerが挿入される', () => {
  const initial_answer = initial_state.exam[initial_state.current_editing].answer;
  [-1, 1, initial_answer.length].forEach(at => {
    const inserted_answer = (() => {
      const inserted = edit_reducer(dup(initial_state), {type: 'q:answer/insert', at});
      return inserted.exam[inserted.current_editing].answer;
    })();
    test('answer.lengthが増加する', () => {
      expect(inserted_answer.length).toBe(initial_answer.length + 1);
    });
    if (at < 0) {
      test('場所として負の数を渡すと、先頭に空のanswerが挿入される', () => {
        expect(inserted_answer.at(0)).not.toStrictEqual(initial_answer[0]);
        expect(inserted_answer.at(0)).toBe('');
      });
    } else if (at > initial_answer.length - 1) {
      test('場所としてanswer.lengthより大きい数を渡すと、末尾に空の問題が挿入される', () => {
        expect(inserted_answer.at(inserted_answer.length - 1)).not.toStrictEqual(
          initial_answer[initial_answer.length - 1],
        );
        expect(inserted_answer[inserted_answer.length - 1]).toBe('');
      });
    } else {
      test('場所としてanswerの範囲内の場所を指定した際、その場所に空の問題が挿入される', () => {
        expect(inserted_answer.at(at)).not.toStrictEqual(initial_answer[at]);
        expect(inserted_answer.at(at)).toBe('');
      });
    }
  });
});
describe('q:answer/removeによってanswerが削除される', () => {
  const initial_answer = initial_state.exam[initial_state.current_editing].answer;
  [-1, 1, initial_answer.length].forEach(at => {
    const inserted_answer = (() => {
      const inserted = edit_reducer(dup(initial_state), {type: 'q:answer/remove', at});
      return inserted.exam[inserted.current_editing].answer;
    })();
    test('answer.lengthが減少する', () => {
      expect(inserted_answer.length).toBe(initial_answer.length - 1);
    });
    if (at < 0) {
      test('場所として負の数を渡すと、先頭が削除される', () => {
        expect(inserted_answer.at(0)).not.toStrictEqual(initial_answer[0]);
      });
    } else if (at > initial_answer.length - 1) {
      test('場所としてanswer.lengthより大きい数を渡すと、末尾が削除される', () => {
        expect(inserted_answer.at(inserted_answer.length - 1)).not.toStrictEqual(
          initial_answer[initial_answer.length - 1],
        );
      });
    } else {
      test('場所としてanswerの範囲内の場所を指定した際、その場所が削除される', () => {
        expect(inserted_answer.at(at)).not.toStrictEqual(initial_answer[at]);
      });
    }
  });
});
test('q:answer/removeによってanswerの要素数は0にならない', () => {
  const initial: StateType = {
    ...initial_state,
    current_editing: 0,
    list: '',
    exam: [empty_exam],
  };
  expect(initial.exam[0].answer.length).toBe(1);
  expect(edit_reducer(dup(initial), {type: 'q:answer/remove', at: 0}).exam[0].answer.length).toBe(
    initial.exam[0].answer.length,
  );
});

describe('q:choice/insertによって空のchoiceが挿入される', () => {
  const initial_choices = initial_state.exam[initial_state.current_editing].question_choices;
  if (!initial_choices) {
    throw new Error('question_choices is not defined');
  }
  [-1, 1, initial_choices.length].forEach(at => {
    const inserted_choices = (() => {
      const inserted = edit_reducer(dup(initial_state), {type: 'q:choice/insert', at});
      return inserted.exam[inserted.current_editing].question_choices;
    })();
    if (!inserted_choices) {
      throw new Error('inserted_choices is not defined');
    }
    test('choice.lengthが増加する', () => {
      expect(inserted_choices.length).toBe(initial_choices.length + 1);
    });
    if (at < 0) {
      test('場所として負の数を渡すと、先頭に空のchoiceが挿入される', () => {
        expect(inserted_choices.at(0)).not.toStrictEqual(initial_choices[0]);
        expect(inserted_choices.at(0)).toBe('');
      });
    } else if (at > initial_choices.length - 1) {
      test('場所としてchoice.lengthより大きい数を渡すと、末尾に空の問題が挿入される', () => {
        expect(inserted_choices.at(inserted_choices.length - 1)).not.toStrictEqual(
          initial_choices[initial_choices.length - 1],
        );
        expect(inserted_choices[inserted_choices.length - 1]).toBe('');
      });
    } else {
      test('場所としてchoiceの範囲内の場所を指定した際、その場所に空の問題が挿入される', () => {
        expect(inserted_choices.at(at)).not.toStrictEqual(initial_choices[at]);
        expect(inserted_choices.at(at)).toBe('');
      });
    }
  });
});
describe('q:choice/removeによってchoiceが削除される', () => {
  const initial_choices = initial_state.exam[initial_state.current_editing].question_choices;
  if (!initial_choices) {
    throw new Error('question_choices is not defined');
  }
  [-1, 1, initial_choices.length].forEach(at => {
    const inserted_choices = (() => {
      const inserted = edit_reducer(dup(initial_state), {type: 'q:choice/remove', at});
      return inserted.exam[inserted.current_editing].question_choices;
    })();
    if (!inserted_choices) {
      throw new Error('inserted_choices is not defined');
    }
    test('choice.lengthが減少する', () => {
      expect(inserted_choices.length).toBe(initial_choices.length - 1);
    });
    if (at < 0) {
      test('場所として負の数を渡すと、先頭が削除される', () => {
        expect(inserted_choices.at(0)).not.toStrictEqual(initial_choices[0]);
      });
    } else if (at > initial_choices.length - 1) {
      test('場所としてchoice.lengthより大きい数を渡すと、末尾が削除される', () => {
        expect(inserted_choices.at(inserted_choices.length - 1)).not.toStrictEqual(
          initial_choices[initial_choices.length - 1],
        );
      });
    } else {
      test('場所としてchoiceの範囲内の場所を指定した際、その場所が削除される', () => {
        expect(inserted_choices.at(at)).not.toStrictEqual(initial_choices[at]);
      });
    }
  });
});
test('q:choices/removeによってchoicesの要素数は0にならない', () => {
  const initial: StateType = {
    ...initial_state,
    current_editing: 0,
    list: '',
    exam: [empty_exam],
  };
  expect(initial.exam[0].question_choices?.length).toBe(1);
  expect(edit_reducer(dup(initial), {type: 'q:choice/remove', at: 0}).exam[0].question_choices?.length).toBe(
    initial.exam[0].question_choices?.length,
  );
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
  expect(edit_reducer(dup(initial_state), {type: 'index/next'}).current_editing).toBe(
    initial_state.current_editing + 1,
  );
});
test('index/lastを行うと、current_editingがexam.length-1になる', () => {
  expect(initial_state.current_editing).not.toBe(initial_state.exam.length - 1);
  expect(edit_reducer(dup(initial_state), {type: 'index/last'}).current_editing).toBe(initial_state.exam.length - 1);
});
