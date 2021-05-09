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
export function ClearExamHistory() {
  return ExamHisotryInstance().clear();
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
  return FavoriteInstance().getItem('main')
    .then((value) => {
      const result: number[] = value ?? [];
      return result;
    });
}
export function UpdateFavorite(target: number) {
  GetFavorite().then(res => {
    const place = res.indexOf(target);
    let result = res;
    // 見つからなかったときは追加
    if (place === -1) {
      result.push(target);
    } else {
      // 見つかった場合は削除
      result = res.filter(n => n !== target);
    }
    FavoriteInstance().setItem('main', result);
  })
}
