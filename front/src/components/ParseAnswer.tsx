// TAGether - Share self-made exam for classmates
// ParseAnswer.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react';
import Exam from '../types/Exam';

// ans_listをいい感じに整形して返す
// Ex. exam.type = 'Text' && ans_list = ['first', 'second'] 
//     => <><span>1問目: first</span><br /><span>2問目: second</span>
export default function ParseAnswers(ans_list: string[], exam: Exam): React.ReactElement {
  const result: string[] = [];

  // 選択系だった場合、answerにはインデックスが格納されているため、対応する選択肢に置き換えて返す
  if ((exam.type === 'Select' || exam.type === 'MultiSelect') && exam.question_choices) {
    // 長さが1だった場合（複数選択でも1つの答えである可能性がある）
    if (exam.answer.length === 1) {
      if (ans_list[0] !== '')
        result.push(exam.question_choices[Number(ans_list[0])]);
    } else {
      // 複数選択の場合
      for (let j = 0; j < ans_list.length; j++) {
        if (ans_list[j] !== '')
          // choices? にしないとエラー出る なんでだろう
          result.push(exam.question_choices ? `・${exam.question_choices[Number(ans_list[j])]}` : '');
      }
    }
  } else {
    // それ以外（テキスト、並べ替え）の場合はふつうにanswerから
    if (ans_list.length === 1) {
      result.push(ans_list[0]);
    } else {
      for (let j = 0; j < exam.answer.length; j++) {
        result.push(`${j + 1} ${(exam.type ?? 'Text') === 'Sort' ? '' : '問目'}: ${ans_list[j]} `);
      }
    }
  }

  return <>{
    result.map((e, i) => <span key={`parsed_answer_${i}`}>{e}<br /></span>)
  }</>;
}
