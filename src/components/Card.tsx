// TAGether - Share self-made exam for classmates
// Card.tsx
//
// CopyRight (c) 2020 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/Card.module.css';
import React from 'react';
import Router from 'next/router'
import Tag from './Tag'
import Categoly from '../types/Categoly'

export default class ExamCard extends React.Component<any> {
  render() {
    const data: Categoly = this.props.data;
    return (
      <div
        className={css.card}
        onClick={() => Router.push('categoly-detail?id='+data.id)}
      >
        <p className={css.title}>{data.title}</p>
        <p className={css.desc}> {data.desc} </p>
        <Tag tag={data.tag} />
      </div>
    )
  }
}