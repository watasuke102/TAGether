// TAGether - Share self-made exam for classmates
// ExamState.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
interface ExamState {
  // 0=全問正解、1=部分正解、2=全問不正解
  order:              number
  checked:            boolean
  correctAnswerCount: number
  realAnswerList:     React.ReactElement[]
}

export default ExamState;
