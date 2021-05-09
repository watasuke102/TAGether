// TAGether - Share self-made exam for classmates
// index.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import LocalForage from 'localforage';
import ExamHistory from '../types/ExamHistory';

// 解答履歴
function ExamHisotryInstance() {
  return LocalForage.createInstance({
    driver: LocalForage.INDEXEDDB,
    name: 'TAGether',
    storeName: 'history',
    description: '問題の解答履歴'
  })
}
export function AddExamHistory(item: ExamHistory) {
  ExamHisotryInstance().setItem(item.date, item);
}
export function GetExamHistory() {
  let result: ExamHistory[] = [];
  return ExamHisotryInstance().iterate((value: ExamHistory) => { result.push(value); })
    .then(() => { return result; })
}


// お気に入りカテゴリ
function FavoriteInstance() {
  return LocalForage.createInstance({
    driver: LocalForage.INDEXEDDB,
    name: 'TAGether',
    storeName: 'favorite',
    description: 'お気に入り登録したカテゴリ'
  })
}
export function GetFavorite() {
  let result: number[] = [];
  return FavoriteInstance().iterate((value: number) => { result.push(value); })
    .then(() => { return result; })
}
export function AddFavorite(item: number) {
  GetFavorite().then(res => {
    res.push(item);
    FavoriteInstance().setItem('main', res);
  })
}
export function RemoveExamHistory(target: number) {
  GetFavorite().then(res => {
    FavoriteInstance().setItem('main', res.filter(item => (item !== target)));
  })
}
