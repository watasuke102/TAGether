// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import Exam from '@mytypes/Exam';
import {PutCategory} from 'src/app/api/category/[id]/route';

/// 戻り値が空の文字列であれば正しい
export function validate_category(category: PutCategory): string[] {
  const exam: Exam[] = JSON.parse(category.list);
  const error_message: string[] = [];
  if (category.title === '') {
    error_message.push('・タイトルを設定してください');
  }
  if (category.tag.length > 8) {
    error_message.push('・タグは8個以下にしてください');
  }

  // 空きがある問題のインデックス
  const blank_exam = new Set<number>();
  // &が2連続以上している問題
  const irregular_symbol_exam = new Set<number>();
  exam.forEach((e, i) => {
    switch (e.type) {
      // 選択系のタイプの場合、choicesに空欄があるかチェック
      case 'Select':
      case 'MultiSelect':
        if (e.question_choices) {
          e.question_choices?.forEach(choice => choice === '' && blank_exam.add(i + 1));
        } else {
          blank_exam.add(i + 1);
        }
        break;
    }
    // 問題文が空欄かチェック
    if (e.question === '') blank_exam.add(i + 1);

    // 答え関連のチェック
    let answer_str = '';
    // 答えが1つ以上あるか確認
    // 複数選択ですべてのチェックを外すと0個になったりする
    if (e.answer.length === 0) {
      blank_exam.add(i + 1);
    } else {
      // 答えに空欄があるかチェック
      e.answer.forEach(str => {
        // forEachのついでにjoin(' ')みたいなことをする
        // joinを呼ぶ必要がないのでほんの少しだけ速くなるかも？
        answer_str += `${str} `;
        if (str === '') blank_exam.add(i + 1);
      });
    }

    // 使用できない記号などが含まれてないか確認
    const check = `${e.question} ${e.question_choices?.join(' ') ?? ''} ${answer_str} ${e.comment ?? ''}`;
    // `"` があった場合 -1 以外の数字が来る
    if (check.search('"') !== -1) irregular_symbol_exam.add(i + 1);
    // `\`が1つ以上連続している部分文字列を切り出して、\の数が奇数だったら駄目
    check.match(/\\+/g)?.forEach(part => {
      if (part.length % 2 === 1) {
        irregular_symbol_exam.add(i + 1);
      }
    });
  });

  if (blank_exam.size !== 0) {
    const list = Array.from(blank_exam).toString();
    error_message.push(`・問題文もしくは答え・チェックボックスが空の問題があります\n(ページ: ${list})`);
  }
  if (irregular_symbol_exam.size !== 0) {
    const list = Array.from(irregular_symbol_exam).toString();
    error_message.push(`・使用できない記号が含まれています\n(ページ: ${list})`);
  }
  return error_message;
}
