// TAGether - Share self-made exam for classmates
// CategolyManager.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import Exam from '../types/Exam';
import Categoly from '../types/Categoly';

// デフォルト値
function categoly_default() {
  let tmp: Categoly = {
    id: 0, updated_at: '', title: '',
    desc: '', tag: '', list: ''
  }
  return tmp;
}
function exam_default() {
  let tmp: Exam[] = [];
  tmp.push({ question: '', answer: Array<string>(1).fill('') });
  return tmp;
}


export default class CategolyManager {
  private categoly: Categoly = categoly_default();
  private exam: Exam[] = exam_default();

  title()    { return this.categoly.title; }
  id()       { return this.categoly.id; }
  desc()     { return this.categoly.desc; }
  tag()      { return this.categoly.tag; }
  examlist() { return this.exam; }

  question(i: number) { return this.exam[i]; }
  answer(i: number, j: number) { return this.exam[i].answer[j]; }

  InitToDefault() {
    this.categoly = categoly_default();
    this.exam = exam_default();
  }
  json_str() {
    const categoly = {
      id: this.categoly.id, title: this.categoly.title, desc: this.categoly.desc,
      tag: this.categoly.tag, list: JSON.stringify(this.exam)
    }
    categoly.list = categoly.list.replace(/(?<!\\)\\n/g, '\\\\n');
    return JSON.stringify(categoly);
  }
  /*
   * カテゴリ関連
   */
  UpdateCategoly(type: string, str: string) {
    let tmp = this.categoly;
    switch (type) {
      case 'title': tmp.title = str; break;
      case 'desc':  tmp.desc  = str; break;
      case 'tag':   tmp.tag   = str; break;
    }
    this.categoly = tmp;
  }
  /*
   * テスト関連
   */
  // 問題を追加
  AddExam(before: boolean) {
    if (before) {
      this.exam.unshift({ question: '', answer: Array<string>(1).fill('') });
    } else {
      this.exam.push({ question: '', answer: Array<string>(1).fill('') });
    }
  }
  RemoveExam(i: number) {
    // tmp[i]から要素を1つ削除
    this.exam.splice(i, 1);
  }
  UpdateExam(type: string, str: string, i: number, j: number) {
    if (type == 'question') {
      this.exam[i].question = str;
    } 
    if (type == 'answer') {
      this.exam[i].answer[j] = str;
    } 
  }

 // 答え欄を追加
  AddAnswer(i: number) {
    this.exam[i].answer.push('');
  }
  RemoveAnswer(i: number, j: number) {
    // tmp[i]から要素を1つ削除
    this.exam[i].answer.splice(j, 1);
  }
}
