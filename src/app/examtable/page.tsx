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
import ExamHistory from '@mytypes/ExamHistory';
import {useCategoryData} from '@utils/api/useCategoryData';
import {GetSpecifiedExamHistory} from '@utils/ManageDB';

export default function ExamTablePage(): React.ReactElement {
  const search_params = useSearchParams();
  const id = search_params.get('id');
  const history_id = search_params.get('history_id');

  const [history, SetHistory] = React.useState<ExamHistory | undefined>();
  const [data, is_loading] = useCategoryData(id ?? -1);

  React.useEffect(() => {
    if (id) {
      return;
    }
    const history_id_str = Array.isArray(history_id) ? history_id[0] : history_id ?? '';
    GetSpecifiedExamHistory(history_id_str).then(result => {
      if (result) {
        SetHistory(result);
      } else {
        throw new Error('[FATAL] cannot get ExamHistory');
      }
    });
  }, [search_params, is_loading]);

  if ((id && is_loading) || (history_id && !history)) {
    return <Loading />;
  }

  return <ExamTable data={data} history={history} />;
}
