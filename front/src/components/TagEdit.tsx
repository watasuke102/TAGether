// TAGether - Share self-made exam for classmates
// TagEdit.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/TagEdit.module.scss';
import React from 'react';
import TagData from '../types/TagData';

interface Props {
  tags: TagData[]
  current_tag: TagData[]
  SetTag: Function
}

export default function TagEdit(props: Props): React.ReactElement {
  const [is_picker_open, SetIsPickerOpen] = React.useState(false);
  const [tag, SetTagState] = React.useState(props.current_tag);

  function UpdateTag(e: TagData[]) {
    SetTagState(e); props.SetTag(e);
  }

  return (
    <div className={css.current_tag}>
      <div className={`${css.item} ${css.hover_pointer}`}
        onClick={() => 
          /**/
          UpdateTag([...tag, { name: 'test', updated_at: '', description: '' }])
          /*/
          SetIsPickerOpen(true)/**/}>
        <div className='fas fa-plus' />
        <span>追加</span>
      </div>
      {
        tag.map((e, i) => (
          <div key={`current_tag_${/*e.name*/Math.random()}`} className={css.item}
            onClick={() => UpdateTag(tag.filter((_, j) => j !== i))}>
            <div className='fas fa-times' />
            <span>{e.name}</span>
          </div>
        ))
      }
    </div >
  );
}