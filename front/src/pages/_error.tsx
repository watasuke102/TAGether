// TAGether - Share self-made exam for classmates
// _error.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react';
import Link from 'next/link'

interface Props {code: number}

export default class Error extends React.Component<Props> {
  static getInitialProps({ res, err }) {
    const code = res ? res.statusCode : err ? err.statusCode : null;
    return { code };
  }
  render() {
    return (
      <div>
        <h1>エラーが発生しました: {this.props.code}</h1>
        <Link href="/">ホームに戻る</Link>
      </div>
    );
  }
}