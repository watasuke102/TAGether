// TAGether - Share self-made exam for classmates
// ExamHistory.d.ts
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import Exam from './Exam';

interface ExamHistory {
  history_key?: string;
  id: number;
  title: string;
  date: string;
  total_question: number;
  correct_count: number;
  wrong_exam: Exam[];
}

export default ExamHistory;
