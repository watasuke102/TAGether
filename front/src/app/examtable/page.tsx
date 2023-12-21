// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import {ExamTable} from '@/pages/examtable';
import {useSearchParams} from 'next/navigation';
import React from 'react';
import Loading from '@/common/Loading/Loading';
import { useCategolyData } from '@utils/ApiHooks';
import {categoly_default} from '@utils/DefaultValue';
import {GetSpecifiedExamHistory} from '@utils/ManageDB';
import Categoly from '@mytypes/Categoly';
import ExamHistory from '@mytypes/ExamHistory';

export default function ExamTablePage(): React.ReactElement {
  const search_params = useSearchParams();
  const id = search_params.get('id');
  const history_id = search_params.get('history_id');

  const [is_loading, SetIsLoading] = React.useState(true);
  const OnComplete = (categoly: Categoly) => {
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
          OnComplete(result.categoly);
        } else {
          throw new Error('[FATAL] cannot get ExamHistory');
        }
      });
    }
  });

  return is_loading ? <Loading /> : <ExamTable data={data} history={history} />;
}
