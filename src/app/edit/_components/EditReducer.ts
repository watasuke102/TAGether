// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import React from 'react';
import Exam from '@mytypes/Exam';
import ExamType from '@mytypes/ExamType';

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
      to: ExamType;
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
  }
  return current;
};
