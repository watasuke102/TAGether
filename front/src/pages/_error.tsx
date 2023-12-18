// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {NextPageContext} from 'next';
import Link from 'next/link';
import React from 'react';

interface Props {
  code: number | undefined;
}

export default class Error extends React.Component<Props> {
  static getInitialProps({res, err}: NextPageContext): Props {
    return {
      code: res ? res.statusCode : err ? err.statusCode : undefined,
    };
  }
  render(): React.ReactElement {
    return (
      <div>
        <h1>エラーが発生しました: {this.props.code ?? -1}</h1>
        <Link href='/'>ホームに戻る</Link>
      </div>
    );
  }
}
