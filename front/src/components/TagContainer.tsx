// TAGether - Share self-made exam for classmates
// TagContainer.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/TagContainer.module.scss';
import React from 'react';
import Router from 'next/router';
import TagData from '../types/TagData';

interface Props { tag: TagData[] }

export default function Tag(props: Props): React.ReactElement {
  return (
    <div className={css.tag_container}>
      {
        props.tag.map((e, i) => {
          return (
            <div key={`tagitem_${i}`} className={css.tag}
              onClick={ev => { ev.stopPropagation(); Router.push(`?tag=${e.id ?? `-1&name=${e.name}`}`); }}>
              <span>{e.name}</span>
            </div>
          );
        })}
    </div>
  );
}
