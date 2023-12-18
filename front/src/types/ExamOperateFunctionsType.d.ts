// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import ExamType from './ExamType';

interface ExamOperateFunctionsType {
  Exam: {
    Update: () => void;
    Insert: (at: number) => void;
    Remove: (i: number) => void;
    Swap: (from: number, to: number) => void;
  };
  Type: {
    Update: (i: number, value: ExamType) => void;
  };
  Question: {
    Update: (i: number, value: string) => void;
  };
  QuestionChoices: {
    // i: Examのインデックス j: Choicesのインデックス
    Update: (i: number, j: number, value: string) => void;
    Remove: (i: number, j: number) => void;
    Insert: (i: number, at: number, value?: string) => void;
  };
  Comment: {
    Update: (i: number, value: string) => void;
  };
  Answer: {
    // i: Examのインデックス j: Answerのインデックス
    Update: (i: number, j: number, value: string) => void;
    Remove: (i: number, j: number) => void;
    Insert: (i: number, at: number, value?: string) => void;
  };
}

export default ExamOperateFunctionsType;
