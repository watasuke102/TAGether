// TAGether - Share self-made exam for classmates
// ExamOperateFunctionsType.d.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//

interface ExamOperateFunctionsType {
  Exam: {
    Update: () => void
    Insert: (at: number) => void
    Remove: (i: number) => void
    Swap: (from: number, to: number) => void
  }
  Question: {
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
