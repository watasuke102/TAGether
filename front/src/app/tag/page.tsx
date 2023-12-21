// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './tag.module.scss';
import {useRouter} from 'next/navigation';
import React from 'react';
import Button from '@/common/Button/Button';
import {Card} from '@/common/Card';
import Loading from '@/common/Loading/Loading';
import TagDetail from '@/features/TagDetail/TagDetail';
import {useTagData} from '@utils/ApiHooks';
import TagData from '@mytypes/TagData';

export default function Tag(): React.ReactElement {
  const [is_modal_open, SetIsModalOpen] = React.useState(false);
  const [tags, isLoading, error] = useTagData();
  const router = useRouter();

  function TagItem(e: TagData) {
    const [is_modal_open, SetIsModalOpen] = React.useState(false);
    return (
      <div className={css.card_wrapper}>
        <Card key={`tag_${e.id}`} onClick={() => SetIsModalOpen(true)}>
          <div className={css.card}>
            <span className={css.name}>{e.name}</span>
            <span className={css.desc}>{e.description}</span>
          </div>
          <TagDetail tag={e} isOpen={is_modal_open} close={() => SetIsModalOpen(false)} onComplete={router.reload} />
        </Card>
      </div>
    );
  }

  if (error) return <span>Error</span>;
  if (isLoading || !tags) return <Loading />;

  return (
    <>
      <div className={css.heading}>
        <h1>タグ一覧</h1>
        <div className={css.button}>
          <Button type='filled' text='新規作成' icon='fas fa-plus' OnClick={() => SetIsModalOpen(true)} />
        </div>
      </div>

      <div className={css.container}>
        {tags.length === 0 ? (
          <p>見つかりませんでした</p>
        ) : isLoading ? (
          <Loading />
        ) : (
          tags.map(e => <TagItem key={`tagcard_${e.id ?? ''}`} {...e} />)
        )}
      </div>

      <TagDetail
        createMode
        isOpen={is_modal_open}
        tag={{name: '', description: '', updated_at: ''}}
        close={() => SetIsModalOpen(false)}
        onComplete={router.refresh}
      />
    </>
  );
}
