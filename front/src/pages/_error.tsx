// TAGether - Share self-made exam for classmates
// _error.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react';
import Link from 'next/link';
import { NextPageContext } from 'next';

interface Props { code: number | undefined }

export default class Error extends React.Component<Props> {
  static getInitialProps({ res, err }: NextPageContext): Props {
    const result: Props = {
      code: res ? res.statusCode : err ? err.statusCode : undefined
    };
    return result;
  }
  render(): React.ReactElement {
    return (
      <div>
        <h1>エラーが発生しました: {this.props.code ?? -1}</h1>
        <Link href="/">ホームに戻る</Link>
      </div>
    );
  }
}