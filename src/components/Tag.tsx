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

function generate_tag(body: string) {
  return (
    <div className={css.tag}>{body}</div>
  )
}

export default class Tag extends React.Component<any> {  
  render() {
    let tags: object[] = [];
    this.props.tag.split(',').forEach(element => {
      tags.push(generate_tag(element));
    });
    return (
      <div className={css.tag_container}> {tags} </div>
    )
  }
}
