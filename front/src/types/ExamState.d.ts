// TAGether - Share self-made exam for classmates
// ExamState.ts
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
import AnswerState from './AnswerState';

interface ExamState {
  order: AnswerState;
  checked: boolean;
  userAnswer: string[];
  correctAnswerCount: number;
}

export default ExamState;
