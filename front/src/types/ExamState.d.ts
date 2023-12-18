// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import AnswerState from './AnswerState';

interface ExamState {
  order: AnswerState;
  checked: boolean;
  user_answer: string[];

  total_question: number;
  correct_count: number;
}

export default ExamState;
