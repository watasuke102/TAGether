// TAGether - Share self-made exam for classmates
// Tag.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Tag.module.css';
import React from 'react';

interface TagData {tag: string}

export default function Tag(props: TagData) {  
  let tags: object[] = [];
  props.tag.split(',').forEach(e => {
    tags.push(<div className={css.tag}>{e}</div>);
  });
  return (
    <div className={css.tag_container}> {tags} </div>
  );
}
