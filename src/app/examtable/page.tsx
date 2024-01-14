// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import React from 'react';
import {ExamTableProps, Table} from './_components/Table/Table';
import Loading from '@/common/Loading/Loading';
import {fetch_category_data} from '@utils/api/category';
import {fetch_history} from '@utils/api/history';
import {redirect} from 'next/navigation';

type Props = {
  searchParams: {
    id?: string;
    history_id?: string;
  };
};

export default function ExamTablePage(props: Props): React.ReactElement {
  const [examtable_props, set_examtable_props] = React.useState<ExamTableProps | undefined>();

  React.useEffect(() => {
    (async () => {
      let prop: ExamTableProps;
      if (props.searchParams.id) {
        const category = await fetch_category_data(props.searchParams.id);
        prop = {
          exam: JSON.parse(category.list),
          title: category.title,
          id: props.searchParams.id,
        };
      } else if (props.searchParams.history_id) {
        const history = await fetch_history(props.searchParams.history_id);
        prop = {
          exam: history.exam,
          title: history.title,
          history: history,
        };
      } else {
        redirect('/list');
      }
      set_examtable_props(prop);
    })();
  }, []);

  return examtable_props ? <Table {...examtable_props} /> : <Loading />;
}
