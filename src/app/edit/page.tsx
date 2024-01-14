// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import React from 'react';
import {EditPage, EditPageProps} from './_components/EditPage/EditPage';
import {fetch_category_data} from '@utils/api/category';
import {fetch_tag} from '@utils/api/tag';

type Props = {
  searchParams: {
    id?: string;
  };
};

export default async function Edit(props: Props): Promise<JSX.Element> {
  const [edit_props, set_edit_props] = React.useState<EditPageProps | undefined>();

  React.useEffect(() => {
    (async () => {
      if (!props.searchParams.id) {
        throw Error('id is not specified');
      }
      const category = await fetch_category_data(props.searchParams.id);
      const tags = await fetch_tag();
      set_edit_props({category, tags});
    })();
  }, []);
  return edit_props ? <EditPage {...edit_props} /> : <></>;
}
