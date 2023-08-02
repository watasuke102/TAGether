// TAGether - Share self-made exam for classmates
// exam.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
//
import {ExamComponent} from '@/pages/exam';
import {useRouter} from 'next/router';
import React from 'react';
import Loading from '@/common/Loading/Loading';
import {useCategolyData} from '@/utils/Api';
import {Shuffle} from '@/utils/ArrayUtil';
import {categoly_default} from '@/utils/DefaultValue';
import {GetSpecifiedExamHistory} from '@/utils/ManageDB';
import AnswerState from '@mytypes/AnswerState';
import Categoly from '@mytypes/Categoly';
import Exam from '@mytypes/Exam';
import ExamHistory from '@mytypes/ExamHistory';

export default function ExamPage(): React.ReactElement {
  const router = useRouter();
  const {id, history_id, tag, shuffle, begin, end} = router.query;

  const [is_loading, SetIsLoading] = React.useState(true);
  const OnComplete = (categoly: Categoly) => {
    let list: Exam[] = JSON.parse(categoly.list);
    const begin_index = Array.isArray(begin) ? Number(begin[0]) : Number(begin ?? 0);
    let end_index = Array.isArray(end) ? Number(end[0]) : Number(end);
    if (!end_index || end_index <= 0) {
      end_index = list.length - 1;
    }
    list = list.slice(begin_index, end_index + 1);

    if (shuffle === 'true') {
      list = Shuffle(list);
    }
    categoly.list = JSON.stringify(list);
    SetData(categoly);
    SetIsLoading(false);
  };

  const [data, SetData] = React.useState<Categoly>(categoly_default());
  const [history, SetHistory] = React.useState<ExamHistory | undefined>();
  useCategolyData(false, categoly => {
    if (id !== undefined) {
      // 通常
      OnComplete(categoly[0]);
    } else if (history_id !== undefined) {
      // 履歴からの解き直し
      const history_id_str = Array.isArray(history_id) ? history_id[0] : history_id ?? '';
      GetSpecifiedExamHistory(history_id_str).then(result => {
        if (result) {
          SetHistory(result);
          const exam: Exam[] = JSON.parse(result.categoly.list);
          const wrong_exam = exam.filter((_, i) => result.exam_state[i].order !== AnswerState.AllCorrect);

          OnComplete({
            ...result.categoly,
            list: JSON.stringify(wrong_exam),
          });
        } else {
          throw new Error('[FATAL] cannot get ExamHistory');
        }
      });
    } else if (tag !== undefined) {
      // 特定のタグ付き問題を解く
      const filter = Array.isArray(tag) ? tag[0] : tag ?? '';
      let list: Exam[] = [];
      categoly.forEach(e => {
        let tag_included = false;
        // タグが含まれているかどうかをチェック
        e.tag.forEach(tag => {
          if (tag_included) return;
          tag_included = tag.name === filter;
        });
        // タグが含まれているカテゴリであれば、問題を追加
        if (tag_included) {
          list = list.concat(JSON.parse(e.list));
        }
      });
      OnComplete({
        ...categoly_default(),
        title: `タグ(${filter})`,
        list: JSON.stringify(list),
      });
    }
  });

  return is_loading ? (
    <Loading />
  ) : (
    <ExamComponent data={data} history_id={history_id} history={history} tag_filter={tag} />
  );
}
