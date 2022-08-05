// TAGether - Share self-made exam for classmates
// ExamHistory.d.ts
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import Categoly from './Categoly';

interface ExamHistory {
  history_key?: string;
  total_question: number;
  correct_count: number;

  times: number;
  categoly: Categoly;
  user_answers: ExamState[];
  original_title: string;
}

export default ExamHistory;
