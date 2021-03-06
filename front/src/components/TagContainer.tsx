// TAGether - Share self-made exam for classmates
// TagContainer.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/components/TagContainer.module.scss';
import React from 'react';
import TagData from '../types/TagData';
import TagDetail from './TagDetail';

interface Props { tag: TagData[] }

export default function Tag(props: Props): React.ReactElement {
  function TagItem(tag_data: TagData) {
    const [is_modal_open, SetIsModalOpen] = React.useState(false);
    return (
      <>
        <div key={`tagitem_${tag_data.id}`} className={css.tag}
          onClick={e => { e.stopPropagation(); SetIsModalOpen(true); }}>
          <span>{tag_data.name}</span>
        </div>
        <TagDetail tag={tag_data} isOpen={is_modal_open}
          close={() => SetIsModalOpen(false)} />
      </>
    );
  }
  return (
    <div className={css.tag_container}>
      {props.tag.map(e => TagItem(e))}
    </div>
  );
}