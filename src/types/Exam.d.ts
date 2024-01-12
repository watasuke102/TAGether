// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import ExamType from './ExamType';

interface Exam {
  type?: ExamType;
  question: string;
  question_choices?: string[];
  answer: string[];
  comment?: string;
}

export default Exam;
