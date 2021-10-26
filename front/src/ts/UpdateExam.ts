// TAGether - Share self-made exam for classmates
// UpdateExam.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//

import Exam from '../types/Exam';
import ExamOperateFunctionsType from "../types/ExamOperateFunctionsType";

export default function UpdateExam(updater: Function, exam: Exam[]): ExamOperateFunctionsType {
  const exam_template: Exam = { question: '', answer: [''] }
  return {
    Exam: {
      Insert: (at: number) => {
        exam.splice((at === -1)? exam.length : at, 0, exam_template);
        updater(exam);
      },
      Remove: (i: number) => {
        exam.splice(i, 1);
        updater(exam);
      },
      Move: (from: number, to: number) => {
        const tmp = exam[from];
        exam[from] = exam[to];
        exam[to] = tmp;
        updater(exam);
      },
    },
    Question: {
      Update: (i: number, value: string) => {
        exam[i].question = value;
        updater(exam);
      }
    },
    Answer: {
      // i: Examのインデックス j: Answerのインデックス
      Update: (i: number, j: number, value: string) => {
        exam[i].answer[j] = value;
        updater(exam);
      },
      Remove: (i: number, j: number) => {
        exam[i].answer.splice(j, 1);
        updater(exam);
      },
      Insert: (i: number, at: number) => {
        exam[i].answer.splice((at === -1)? exam[i].answer.length : at, 0, '');
        updater(exam);
      },
    },
  };
}
