// TAGether - Share self-made exam for classmates
// UpdateExam.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//

import Exam from '@mytypes/Exam';
import ExamType from '@mytypes/ExamType';
import ExamOperateFunctionsType from '@mytypes/ExamOperateFunctionsType';

export default function UpdateExam(updater: (e: Exam[]) => void, exam: Exam[]): ExamOperateFunctionsType {
  return {
    Exam: {
      Update: () => updater(exam),
      Insert: (at: number) => {
        exam.splice(at === -1 ? exam.length : at, 0, {
          type: 'Text',
          question: '',
          question_choices: [],
          answer: [''],
          comment: '',
        });
        updater(exam);
      },
      Remove: (i: number) => {
        if (exam.length === 1) return;
        exam.splice(i, 1);
        updater(exam);
      },
      Swap: (from: number, to: number) => {
        const tmp = exam[from];
        exam[from] = exam[to];
        exam[to] = tmp;
        updater(exam);
      },
    },
    Type: {
      Update: (i: number, value: ExamType) => {
        exam[i].type = value;
        updater(exam);
      },
    },
    Question: {
      Update: (i: number, value: string) => {
        exam[i].question = value;
        updater(exam);
      },
    },
    QuestionChoices: {
      // i: Examのインデックス j: question_choiceのインデックス
      Update: (i: number, j: number, value: string) => {
        // choicesはエラー回避のために存在する
        const choices: string[] = exam[i].question_choices ?? [];
        choices[j] = value;
        exam[i].question_choices = choices;
        updater(exam);
      },
      Remove: (i: number, j: number) => {
        if (!exam[i].question_choices) exam[i].question_choices = [];
        exam[i].question_choices?.splice(j, 1);
        updater(exam);
      },
      Insert: (i: number, at: number, value?: string) => {
        if (!exam[i].question_choices) exam[i].question_choices = [];
        exam[i].question_choices?.splice(at === -1 ? exam[i].question_choices?.length ?? 0 : at, 0, value ?? '');
        updater(exam);
      },
    },
    Comment: {
      Update: (i: number, value: string) => {
        exam[i].comment = value;
        updater(exam);
      },
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
      Insert: (i: number, at: number, value?: string) => {
        exam[i].answer.splice(at === -1 ? exam[i].answer.length : at, 0, value ?? '');
        updater(exam);
      },
    },
  };
}
