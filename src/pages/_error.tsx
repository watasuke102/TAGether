// TAGether - Share self-made exam for classmates
// _error.tsx
//
// CopyRight (c) 2020 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react';
import Link from 'next/link'

export default class Error extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }
  render() {
    return (
      <div>
        <h1>エラーが発生しました: {this.props.statusCode}</h1>
        <Link href="/">ホームに戻る</Link>
      </div>
    );
  }
}