// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './PrivacyPolicy.module.scss';
import React from 'react';
import ArrowLeftIcon from '@assets/arrow-left.svg';
import Link from 'next/link';

export default function PrivacyPolicy(): React.ReactElement {
  return (
    <>
      <header className={css.header}>
        <Link href='/'>
          <ArrowLeftIcon />
        </Link>
      </header>
      <main>
        <h1>プライバシーポリシー</h1>
        <ul>
          <li>TAGether（以下、当サービス）では、主にログイン情報を保存するためにCookieを使用しています</li>
          <li>当サービスでは、以下の目的のため、ユーザーの個人情報を取得・保存します：</li>
          <ol>
            <li>ユーザーに当サービスを提供する目的</li>
            <li>ユーザーを一意に特定する目的</li>
            <li>ユーザーによるサービスの利用状況を監視・保持する目的</li>
            <li>その他、以上の目的に付随する目的</li>
          </ol>
          <ul>
            <li>
              ここでの「個人情報」とは、Googleアカウントに紐付けられた識別子およびメールアドレスを主に指しますが、これに限定されません
            </li>
          </ul>
          <li>本プライバシーポリシーは改定される可能性があります</li>
        </ul>
      </main>
    </>
  );
}
