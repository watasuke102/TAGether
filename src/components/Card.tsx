// TAGether - Share self-made exam for classmates
// Card.tsx
//
// CopyRight (c) 2020 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react';

export default class ExamCard extends React.Component<any, any> {
  render() {
    return (
      <li>
        title: {this.props.title}, desc: {this.props.desc}
      </li>
    )
  }
}