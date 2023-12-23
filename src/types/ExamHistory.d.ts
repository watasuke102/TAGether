// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {CategoryDataType} from './Categoly';

interface ExamHistory {
  history_key?: string;
  total_question: number;
  correct_count: number;

  times: number;
  categoly: CategoryDataType;
  exam_state: ExamState[];
  original_title: string;
}

export default ExamHistory;
