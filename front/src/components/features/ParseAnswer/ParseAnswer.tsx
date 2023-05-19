// TAGether - Share self-made exam for classmates
// ParseAnswer.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
//
import css from './ParseAnswer.module.scss';
import React from 'react';
import Exam from '@mytypes/Exam';

/*
ans_listをいい感じに整形して返す
また、間違えた問題は強調表示する
（examからの呼び出し時、ans_listは正しい答えであるため、cmpに自分の解答を渡す）
Ex. exam.type = 'Text' && ans_list = ['first', 'second']
   => <><span>1問目: first</span><br /><span>2問目: second</span></>
*/
export default function ParseAnswers(ans_list: string[], exam: Exam, cmp?: string[]): React.ReactElement {
  const result: string[] = [];
  const compare = cmp ?? exam.answer;

  // 選択系だった場合、answerにはインデックスが格納されているため、対応する選択肢に置き換えて返す
  if ((exam.type === 'Select' || exam.type === 'MultiSelect') && exam.question_choices) {
    // 長さが1だった場合（複数選択でも1つの答えである可能性がある）
    if (exam.answer.length === 1) {
      if (ans_list[0] !== '') result.push(exam.question_choices[Number(ans_list[0])]);
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

  // 間違えた問題を強調表示するため、間違えた問題リストを作る
  const wrong_list: boolean[] = result.map((_, i) => {
    if (exam.type === 'MultiSelect') {
      // 解答が[A, C]で、正しい答えが[B,C]だった場合、
      // - exam中の正しい答え表示→B強調+C = <解答>に存在しない<正しい答え>を強調
      // - examtable→A強調+C = <正しい答え>に存在しない<解答>を強調
      // exam     中は (ans_list, compare) = (正しい答え, 解答) であり、
      // examtable中は (ans_list, compare) = (解答, 正しい答え) であることを利用する
      return !compare.includes(ans_list[i]);
    } else if (exam.type === 'Text') {
      // 解答が[A, E]で、正しい答えが[A&B, C&D]だった場合、
      // all_listは[A, A, B] | [E, C, D]
      // つまり、重複があれば (setにしたものとlengthが異なれば) 正解
      const all_list = ans_list[i].split('&').concat(compare[i].split('&'));
      const set = new Set(all_list);
      return set.size === all_list.length;
    } else {
      return ans_list[i] !== compare[i];
    }
  });

  return (
    <>
      {result.map((e, i) => (
        <div key={`parsed_answer_${i}`} className={wrong_list[i] ? css.wrong : ''}>
          {e}
          <br />
        </div>
      ))}
    </>
  );
}
