// TAGether - Share self-made exam for classmates
// exam.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import {Exam} from '@/pages/exam';
import {useRouter} from 'next/router';
import React from 'react';
import Loading from '@/common/Loading/Loading';
import {useCategolyData} from '@/utils/Api';
import {categoly_default} from '@/utils/DefaultValue';
import {GetSpecifiedExamHistory} from '@/utils/ManageDB';
import Categoly from '@mytypes/Categoly';

export default function ExamPage(): React.ReactElement {
  const router = useRouter();
  const {id, history_id, tag} = router.query;

  const [isLoading, SetIsLoading] = React.useState(true);
  const [data, SetData] = React.useState<Categoly>(categoly_default());
  useCategolyData(categoly => {
    if (id !== undefined) {
      // 通常
      SetData(categoly[0]);
      SetIsLoading(false);
    } else if (history_id !== undefined) {
      // 履歴からの解き直し
      const history_id_str = Array.isArray(history_id) ? history_id[0] : history_id ?? '';
      GetSpecifiedExamHistory(history_id_str).then(result => {
        if (result) {
          SetData({
            ...categoly_default(),
            title: `やり直し: ${result.title}`,
            list: JSON.stringify(result.wrong_exam),
          });
          SetIsLoading(false);
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
      console.log('[TAGFILTER] ', list);
      SetData({
        ...categoly_default(),
        title: `タグ(${filter})`,
        list: JSON.stringify(list),
      });
      SetIsLoading(false);
    }
  });

  return isLoading ? <Loading /> : <Exam data={data} history_id={history_id} tag_filter={tag} />;
}
