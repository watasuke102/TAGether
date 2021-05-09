// TAGether - Share self-made exam for classmates
// index.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import LocalForage from 'localforage';
import { format } from 'date-fns';
import ExamHistory from '../types/ExamHistory';

export function ExamHisotryInstance() {
  return LocalForage.createInstance({
    driver: LocalForage.INDEXEDDB,
    name: 'TAGether',
    storeName: 'history',
    description: '問題の解答履歴'
  })
}

// format(new Date(), 'YYYY-MM-DD HH:mm:ss')
export function AddExamHistory(item: ExamHistory) {
  ExamHisotryInstance().setItem(item.date, item);
}

export function GetExamHistory() {
  let result: ExamHistory[] = [];
  return ExamHisotryInstance().iterate((value: ExamHistory) => { result.push(value); })
    .then(() => { return result; })
}

export function ClearExamHistory() {
  ExamHisotryInstance().clear();
}
