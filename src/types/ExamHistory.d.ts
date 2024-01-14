// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import Exam from './Exam';
import ExamState from './ExamState';

export interface AllHistory {
  id: string;
  created_at: string;
  title: string;
  redo_times: number;
  exam_state: ExamState[];
}

export interface History extends AllHistory {
  exam: Exam[];
}
