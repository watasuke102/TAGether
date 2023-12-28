// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import React from 'react';
import Exam from '@mytypes/Exam';
import ExamType from '@mytypes/ExamType';
import {Swap} from '@utils/ArrayUtil';

type ReducerType = (current: StateType, action: Action) => StateType;
export const ExamReducerContext = React.createContext<ReducerType | null>(null);

// state.current_editingに依存するもの: prefix 'q:'
export type Action =
  | {
      type: 'title/set' | 'desc/set' | 'list/set' | 'q:question/set' | 'q:comment/set';
      data: string;
    }
  | {
      type: 'q:type/set';
      data: ExamType;
    }
  | {
      type: 'q:choice/set' | 'q:answer/set';
      data: string;
      index: number;
    }
  | {
      type:
        | 'index/jump'
        | 'exam/insert'
        | 'exam/remove'
        | 'q:answer/insert'
        | 'q:answer/remove'
        | 'q:choice/insert'
        | 'q:choice/remove';
      at: number;
    }
  | {
      type: 'exam/swap' | 'q:answer/swap' | 'q:choice/swap';
      from: number;
      to: number;
    }
  | {
      type: 'index/first' | 'index/prev' | 'index/next' | 'index/last';
    };

export type StateType = {
  current_editing: number;
  title: string;
  desc: string;
  list: string;
  exam: Exam[];
};

export const edit_reducer: ReducerType = (current, action) => {
  switch (action.type) {
    case 'title/set':
      current.title = action.data;
      break;
    case 'desc/set':
      current.desc = action.data;
      break;
    case 'list/set':
      current.list = action.data;
      break;
    case 'q:question/set':
      current.exam[current.current_editing].question = action.data;
      break;
    case 'q:comment/set':
      current.exam[current.current_editing].comment = action.data;
      break;
    case 'q:type/set':
      current.exam[current.current_editing].type = action.data;
      break;
    case 'q:choice/set':
      let choices = current.exam[current.current_editing].question_choices ?? new Array(action.index).fill('');
      // when the index is N, the length of choices must be more than N+1
      if (choices.length <= action.index) {
        choices = choices.concat(new Array(action.index + 1 - choices.length));
      }
      choices[action.index] = action.data;
      current.exam[current.current_editing].question_choices = choices;
      break;
    case 'q:answer/set':
      let answer = current.exam[current.current_editing].answer;
      // when the index is N, the length of answers must be more than N+1
      if (answer.length <= action.index) {
        answer = answer.concat(new Array(action.index + 1 - answer.length));
      }
      answer[action.index] = action.data;
      current.exam[current.current_editing].answer = answer;
      break;

    case 'exam/swap':
      current.exam = Swap(current.exam, action.from, action.to);
      break;
    case 'q:answer/swap':
      current.exam[current.current_editing].answer = Swap(
        current.exam[current.current_editing].answer,
        action.from,
        action.to,
      );
      break;
    case 'q:choice/swap':
      current.exam[current.current_editing].question_choices = Swap(
        current.exam[current.current_editing].question_choices ?? [],
        action.from,
        action.to,
      );
      break;

    // spliceの第1引数にlength以上の値を渡すと、末尾に追加となる
    case 'exam/insert':
      current.exam.splice(Math.max(action.at, 0), 0, {
        type: 'Text',
        question: '',
        question_choices: [''],
        answer: [''],
        comment: '',
      });
      break;
    case 'exam/remove': {
      const len = current.exam.length;
      if (len > 1) {
        const at = Math.max(Math.min(action.at, len - 1), 0);
        current.exam.splice(at, 1);
      }
      break;
    }
    case 'q:answer/insert': {
      if (current.exam[current.current_editing].answer.length > 1) {
        current.exam[current.current_editing].answer.splice(Math.max(action.at, 0), 0, '');
      }
      break;
    }
    case 'q:answer/remove': {
      const len = current.exam[current.current_editing].answer.length;
      if (len > 1) {
        const at = Math.max(Math.min(action.at, len - 1), 0);
        current.exam[current.current_editing].answer.splice(at, 1);
      }
      break;
    }
    case 'q:choice/insert': {
      if (!current.exam[current.current_editing].question_choices) {
        break;
      }
      if (current.exam[current.current_editing].question_choices?.length ?? 0 > 1) {
        current.exam[current.current_editing].question_choices?.splice(Math.max(action.at, 0), 0, '');
      }
      break;
    }
    case 'q:choice/remove': {
      if (!current.exam[current.current_editing].question_choices) {
        break;
      }
      const len = current.exam[current.current_editing].question_choices?.length ?? 0;
      if (len > 1) {
        const at = Math.max(Math.min(action.at, len - 1), 0);
        current.exam[current.current_editing].question_choices?.splice(at, 1);
      }
      break;
    }

    case 'index/first':
      current.current_editing = 0;
      break;
    case 'index/prev':
      if (current.current_editing > 0) {
        --current.current_editing;
      }
      break;
    case 'index/next':
      if (current.current_editing < current.exam.length - 1) {
        ++current.current_editing;
      }
      break;
    case 'index/last':
      current.current_editing = current.exam.length - 1;
      break;
    case 'index/jump':
      current.current_editing = action.at;
      break;
  }

  // limit range of current_editing
  if (current.current_editing < 0) {
    current.current_editing = 0;
  } else if (current.current_editing > current.exam.length - 1) {
    current.current_editing = current.exam.length - 1;
  }

  return current;
};
