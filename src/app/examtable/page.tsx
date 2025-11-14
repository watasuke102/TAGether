// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import React from 'react';
import {redirect} from 'next/navigation';
import Loading from '@/common/Loading/Loading';
import {fetch_category_data} from '@utils/api/category';
import {fetch_history} from '@utils/api/history';
import {history_title} from '@utils/HistoryTitle';
import {ExamTableProps, Table} from './_components/Table/Table';

type Props = {
  searchParams: Promise<{
    id?: string;
    history_id?: string;
  }>;
};

export default function ExamTablePage(props: Props): React.ReactElement {
  const [examtable_props, set_examtable_props] = React.useState<ExamTableProps | undefined>();

  React.useEffect(() => {
    (async () => {
      let prop: ExamTableProps;
      const params = await props.searchParams;
      if (params.id) {
        const category = await fetch_category_data(params.id);
        prop = {
          exam: JSON.parse(category.list),
          title: category.title,
          id: params.id,
        };
      } else if (params.history_id) {
        const history = await fetch_history(params.history_id);
        prop = {
          exam: history.exam,
          title: history_title(history),
          history: history,
        };
      } else {
        redirect('/list');
      }
      set_examtable_props(prop);
    })();
  }, [props.searchParams]);

  return examtable_props ? <Table {...examtable_props} /> : <Loading />;
}
