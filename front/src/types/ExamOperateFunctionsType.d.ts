// TAGether - Share self-made exam for classmates
// ExamOperateFunctionsType.d.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//

import ExamType from './ExamType';

interface ExamOperateFunctionsType {
  Exam: {
    Update: () => void
    Insert: (at: number) => void
    Remove: (i: number) => void
    Swap: (from: number, to: number) => void
  }
  Type: {
    Update: (i: number, value: ExamType) => void
  }
  Question: {
    Update: (i: number, value: string) => void
  }
  QuestionChoices: {
    // i: Examのインデックス j: Choicesのインデックス
    Update: (i: number, j: number, value: string) => void
    Remove: (i: number, j: number) => void
    Insert: (i: number, at: number) => void
  }
  Comment: {
    Update: (i: number, value: string) => void
  }
  Answer: {
    // i: Examのインデックス j: Answerのインデックス
    Update: (i: number, j: number, value: string) => void
    Remove: (i: number, j: number) => void
    Insert: (i: number, at: number) => void
  }
}

export default ExamOperateFunctionsType;
