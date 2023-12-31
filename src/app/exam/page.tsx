// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import {ExamComponent} from '@/pages/exam';
import {useSearchParams} from 'next/navigation';
import React from 'react';
import Loading from '@/common/Loading/Loading';
import {Shuffle} from '@utils/ArrayUtil';
import {categoly_default} from '@utils/DefaultValue';
import {GetSpecifiedExamHistory} from '@utils/ManageDB';
import AnswerState from '@mytypes/AnswerState';
import {AllCategoryDataType} from '@mytypes/Categoly';
import Exam from '@mytypes/Exam';
import ExamHistory from '@mytypes/ExamHistory';

type Props = {
  searchParams: {
    id?: string;
    history_id?: string;
    tag?: string;
    shuffle?: string;
    begin?: number;
    end?: number;
  };
};

export default function Exam(props: Props): JSX.Element {
  console.log(props);
  // const search_params = useSearchParams();
  // const id = search_params?.get('id');
  // const history_id = search_params?.get('history_id');
  // const tag = search_params?.get('tag');
  // const shuffle = search_params?.get('shuffle');
  // const begin = search_params?.get('begin');
  // const end = search_params?.get('end');

  // const [category, is_loading] = useCategoryData(id ?? '');
  // const [data, SetData] = React.useState<AllCategoryDataType>(categoly_default());
  // const [history, SetHistory] = React.useState<ExamHistory | undefined>();

  // // const [is_loading, SetIsLoading] = React.useState(true);
  // const OnComplete = (categoly: AllCategoryDataType) => {
  //   let list: Exam[] = JSON.parse(categoly?.list ?? '[]');
  //   const begin_index = Array.isArray(begin) ? Number(begin[0]) : Number(begin ?? 0);
  //   let end_index = Array.isArray(end) ? Number(end[0]) : Number(end);
  //   if (!end_index || end_index <= 0) {
  //     end_index = list.length - 1;
  //   }
  //   list = list.slice(begin_index, end_index + 1);

  //   if (shuffle === 'true') {
  //     list = Shuffle(list);
  //   }
  //   categoly.list = JSON.stringify(list);
  //   SetData(categoly);
  // };

  // if (is_loading) {
  //   return <Loading />;
  // }

  // if (id !== undefined) {
  //   // 通常
  //   OnComplete(category[0]);
  // } else if (history_id !== undefined) {
  //   // 履歴からの解き直し
  //   const history_id_str = Array.isArray(history_id) ? history_id[0] : history_id ?? '';
  //   GetSpecifiedExamHistory(history_id_str).then(result => {
  //     if (result) {
  //       SetHistory(result);
  //       const exam: Exam[] = JSON.parse(result.categoly.list);
  //       const wrong_exam = exam.filter((_, i) => result.exam_state[i].order !== AnswerState.AllCorrect);

  //       OnComplete({
  //         ...result.categoly,
  //         list: JSON.stringify(wrong_exam),
  //       });
  //     } else {
  //       throw new Error('[FATAL] cannot get ExamHistory');
  //     }
  //   });
  // } else if (tag !== undefined) {
  //   // 特定のタグ付き問題を解く
  //   const filter = Array.isArray(tag) ? tag[0] : tag ?? '';
  //   let list: Exam[] = [];
  //   category.forEach(e => {
  //     let tag_included = false;
  //     // タグが含まれているかどうかをチェック
  //     e.tag.forEach(tag => {
  //       if (tag_included) return;
  //       tag_included = tag.name === filter;
  //     });
  //     // タグが含まれているカテゴリであれば、問題を追加
  //     if (tag_included) {
  //       list = list.concat(JSON.parse(e.list));
  //     }
  //   });
  //   OnComplete({
  //     ...categoly_default(),
  //     title: `タグ(${filter})`,
  //     list: JSON.stringify(list),
  //   });
  // }

  // return <ExamComponent data={data} history_id={history_id ?? ''} history={history} tag_filter={tag ?? ''} />;
}
