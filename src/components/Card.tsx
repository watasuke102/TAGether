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

export default class ExamCard extends React.Component<any> {
  render() {
    return (
      <div
        className={css.card}
        onClick={() => Router.push('categoly-detail?id='+this.props.data.id)}
      >
        <p className={css.title}>{this.props.data.title}</p>
        <p className={css.desc}> {this.props.data.desc} </p>
      </div>
    )
  }
}