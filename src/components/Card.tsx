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

export default class ExamCard extends React.Component<any, any> {
  render() {
    return (
      <div className={css.card}>
        <p className={css.title}>{this.props.title}</p>
        <p className={css.desc}> {this.props.desc} </p>
      </div>
    )
  }
}