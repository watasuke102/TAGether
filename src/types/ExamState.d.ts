// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
interface ExamState {
  checked: boolean;
  // result[i] === true -> user_answer[i] is correct
  // **except for MultiSelect** : when result[i] === true...
  //   - choices[Number(result[i])] is included in answer: choice is correctly choosen
  //   - not included: choice is correctly NOT choosen
  user_answer: string[];
  result: boolean[];
  // for displaying the number of correct answer
  total_question: number;
  correct_count: number;
}

export default ExamState;
