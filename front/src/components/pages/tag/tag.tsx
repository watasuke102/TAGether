// TAGether - Share self-made exam for classmates
// tag.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './tag.module.scss';
import React from 'react';
import Router from 'next/router';
import Button from '@/common/Button/Button';
import TagData from '@mytypes/TagData';
import TagDetail from '@/features/TagDetail/TagDetail';

interface Props {
  tags: TagData[];
}

export default function Tag(props: Props): React.ReactElement {
  const [is_modal_open, SetIsModalOpen] = React.useState(false);
  const [tag, SetTag] = React.useState(props.tags);

  function TagItem(e: TagData) {
    const [is_modal_open, SetIsModalOpen] = React.useState(false);
    return (
      <div key={`tag_${e.id}`}>
        <div
          className={css.card}
          onClick={e => {
            e.stopPropagation();
            SetIsModalOpen(true);
          }}
        >
          <span className={css.name}>{e.name}</span>
          <span className={css.desc}>{e.description}</span>
        </div>
        <TagDetail
          tag={e}
          isOpen={is_modal_open}
          close={() => SetIsModalOpen(false)}
          onComplete={e => {
            const result = tag;
            for (let i = 0; i < result.length; i++) {
              if (result[i].id === e.id) {
                result[i] = e;
                break;
              }
            }
            SetTag(result);
          }}
        />
      </div>
    );
  }

  return (
    <>
      <div className={css.heading}>
        <h1>タグ一覧</h1>
        <div className={css.button}>
          <Button type='filled' text='新規作成' icon='fas fa-plus' onClick={() => SetIsModalOpen(true)} />
        </div>
      </div>

      <div className={css.container}>{tag.length === 0 ? <p>見つかりませんでした</p> : tag.map(e => TagItem(e))}</div>

      <TagDetail
        createMode
        isOpen={is_modal_open}
        tag={{name: '', description: '', updated_at: ''}}
        close={() => SetIsModalOpen(false)}
        onComplete={Router.reload}
      />
    </>
  );
}
