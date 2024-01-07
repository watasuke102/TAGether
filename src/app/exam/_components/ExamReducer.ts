// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import React from 'react';
import Exam from '@mytypes/Exam';
import ExamState from '@mytypes/ExamState';
import {Move, Shuffle, ToggleElement} from '@utils/ArrayUtil';
import {check_answer} from '@/features/Exam/CheckAnswer';

type ReducerType = (current: StateType, action: Action) => StateType;
export const ExamReducerContext = React.createContext<[StateType, React.Dispatch<Action>]>([
  init_state([]),
  () => undefined,
]);

export type Action =
  | {
      type: 'text/set';
      at: number;
      data: string;
    }
  | {
      type: 'select/set' | 'multi/toggle' | 'index/set';
      index: number;
    }
  | {
      type: 'sort/move';
      from: number;
      to: number;
    }
  | {
      type: 'is_modal_open/set';
      data: boolean;
    }
  | {
      type: 'handle_button/prev' | 'handle_button/next';
    };

export type StateType = {
  index: number;
  exam: Exam[];
  exam_state: ExamState[];
  is_modal_open: boolean;
};

export function init_state(exam: Exam[]): StateType {
  return {
    index: 0,
    exam: JSON.parse(JSON.stringify(exam)),
    exam_state: exam.map(e => {
      let user_answer: string[];
      switch (e.type) {
        case undefined:
        case 'Text':
          user_answer = Array(e.answer.length).fill('');
          break;
        case 'Select':
        case 'MultiSelect':
          user_answer = [];
          break;
        case 'Sort':
          user_answer = Shuffle(e.answer);
          break;
        default:
          throw Error('Unknown exam type');
      }
      return {
        checked: false,
        user_answer,
        result: [],
        total_question: e.answer.length,
        correct_count: 0,
      };
    }),
    is_modal_open: false,
  };
}

export const exam_reducer: ReducerType = (current, action) => {
  switch (action.type) {
    case 'text/set':
      current.exam_state[current.index].user_answer[action.at] = action.data;
      break;
    case 'select/set':
      current.exam_state[current.index].user_answer = [String(action.index)];
      break;
    case 'multi/toggle': {
      const data = String(action.index);
      current.exam_state[current.index].user_answer = ToggleElement(
        current.exam_state[current.index].user_answer,
        data,
      );
      break;
    }
    case 'sort/move':
      current.exam_state[current.index].user_answer = Move(
        current.exam_state[current.index].user_answer,
        action.from,
        action.to,
      );
      break;
    case 'index/set':
      if (action.index >= 0 && action.index < current.exam.length) {
        current.index = action.index;
      }
      break;
    case 'is_modal_open/set':
      current.is_modal_open = action.data;
      break;
    case 'handle_button/prev':
      if (current.index > 0) {
        --current.index;
      }
      break;
    case 'handle_button/next':
      if (current.exam_state[current.index].checked) {
        if (current.index < current.exam.length - 1) {
          ++current.index;
        } else {
          current.is_modal_open = true;
        }
      } else {
        current.exam_state[current.index] = check_answer(
          current.exam[current.index],
          current.exam_state[current.index].user_answer,
        );
      }
      break;
  }
  return current;
};
