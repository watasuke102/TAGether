// TAGether - Share self-made exam for classmates
// tag.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/tag.module.scss';
import React from 'react';
import Router from 'next/router';
import { GetServerSideProps } from 'next';
import Button from '../components/Button';
import GetFromApi from '../ts/Api';
import TagData from '../types/TagData';
import TagDetail from '../components/TagDetail';

interface Props { tag: TagData[] }

export default function tag(props: Props): React.ReactElement {
  const [is_modal_open, SetIsModalOpen] = React.useState(false);
  const [tag, SetTag] = React.useState(props.tag);

  function TagItem(e: TagData) {
    const [is_modal_open, SetIsModalOpen] = React.useState(false);
    return (
      <>
        <div key={`tagitem_${e.id}`} className={css.card}
          onClick={e => { e.stopPropagation(); SetIsModalOpen(true); }}>
          <span className={css.name}>{e.name}</span>
          <span className={css.desc}>{e.description}</span>
        </div>
        <TagDetail tag={e} isOpen={is_modal_open}
          close={() => SetIsModalOpen(false)} />
      </>);
  }

  return (
    <>
      <h1>タグ一覧</h1>

      <Button type='filled' text='新規作成' icon='fas fa-plus'
        onClick={() => SetIsModalOpen(true)} />

      <div className={css.container}>
        {tag.map(e => TagItem(e))}
      </div>

      <TagDetail createMode isOpen={is_modal_open}
        tag={{ name: '', description: '', updated_at: '' }}
        close={() => SetIsModalOpen(false)}
        onComplete={Router.reload} />
    </>
  );
}


// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await GetFromApi<TagData>('tag', context.query.id);
  return { props: { tag: data } };
};
