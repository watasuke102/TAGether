// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.

import {AllHistory, History} from '@mytypes/ExamHistory';

/// やり直しを考慮した解答履歴のタイトルを返す
export function history_title(history: History | AllHistory): string {
  if (history.redo_times === 0) {
    return history.title;
  }
  return `解き直し：${history.title}（${history.redo_times}回目）`;
}
