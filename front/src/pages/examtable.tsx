// TAGether - Share self-made exam for classmates
// examtable.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import Loading from '@/common/Loading/Loading';
import {ExamTable} from '@/pages/examtable';
import { useCategolyData } from '@/utils/Api';
import { categoly_default } from '@/utils/DefaultValue';
import { GetSpecifiedExamHistory } from '@/utils/ManageDB';
import Categoly from '@mytypes/Categoly';
import Exam from '@mytypes/Exam';
import ExamHistory from '@mytypes/ExamHistory';
import { useRouter } from 'next/router';
import React from 'react';

export default function ExamTablePage(): React.ReactElement {
  const router = useRouter();
  const {id, history_id} = router.query;

  const [isLoading, SetIsLoading] = React.useState(true);
  const OnComplete = (categoly: Categoly) => {
    SetData(categoly);
    SetIsLoading(false);
  };

  const [data, SetData] = React.useState<Categoly>(categoly_default());
  const [history, SetHistory] = React.useState<ExamHistory | undefined>();
  useCategolyData(categoly => {
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

  return isLoading ? <Loading /> : <ExamTable data={data} history={history} />;
}
