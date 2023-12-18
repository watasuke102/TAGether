// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import LocalForage from 'localforage';
import ExamHistory from '@mytypes/ExamHistory';

// 解答履歴
function ExamHisotryInstance() {
  return LocalForage.createInstance({
    driver: LocalForage.INDEXEDDB,
    name: 'TAGether',
    storeName: 'history_v2',
    description: '問題の解答履歴',
  });
}
export function AddExamHistory(item: ExamHistory): Promise<number> {
  const instance = ExamHisotryInstance();
  return instance.keys().then(keys => {
    let key = Math.max(...keys.map(Number)) + 1;
    if (isNaN(key) || key === -Infinity) key = 0;
    instance.setItem(String(key), item);
    return key;
  });
}
export function GetExamHistory(): Promise<ExamHistory[]> {
  const result: ExamHistory[] = [];
  return ExamHisotryInstance()
    .iterate((value: ExamHistory, key: string) => {
      result.push({history_key: key, ...value});
    })
    .then(() => {
      return result;
    });
}

export function RemoveExamHistory(key: string): Promise<void> {
  return ExamHisotryInstance().removeItem(key);
}

export function ClearExamHistory(): Promise<void> {
  return ExamHisotryInstance().clear();
}

export function GetSpecifiedExamHistory(key: string): Promise<ExamHistory | null> {
  return ExamHisotryInstance()
    .getItem<ExamHistory>(key)
    .then(result => {
      return result;
    });
}

// お気に入りカテゴリ
function FavoriteInstance() {
  return LocalForage.createInstance({
    driver: LocalForage.INDEXEDDB,
    name: 'TAGether',
    storeName: 'favorite',
    description: 'お気に入り登録したカテゴリ',
  });
}
export function GetFavorite(): Promise<number[]> {
  return FavoriteInstance()
    .getItem<number[]>('main')
    .then(value => {
      return value ?? [];
    });
}
export function UpdateFavorite(target: number): void {
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
  });
}
