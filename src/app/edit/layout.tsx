// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import Header from '@/features/Header/Header';
import React from 'react';

export const metadata = {
  title: '編集 - TAGether',
};

export default function RootLayout({children}: {children: React.ReactNode}): JSX.Element {
  return (
    <>
      <Header />
      <h1>カテゴリの編集</h1>
      <h2>機能について</h2>
      <ul>
        <li>記号 \ を表示したいときは 「\\」と入力してください（括弧不要）</li>
        <li>
          「答え」の欄に&amp;を入れると、複数の正解を作ることが出来ます
          <br />
          例: 「A&amp;B&amp;C」→解答欄にAもしくはBもしくはCのどれかが入力されたら正解
        </li>
      </ul>
      <h2>制約</h2>
      <ul>
        <li>タグの数は8個以下にしてください</li>
        <li>タイトル及びすべての問題文・答えに空欄を作ることはできません</li>
        <li>選択問題の場合はかならず1つ以上の問題にチェックが必要です （入力欄左のチェックボックスを確認すること）</li>
        <li>記号 &quot; は使用できません </li>
        <li>\\ 以外で記号 \ は使用できません（必ず空白無しで偶数個記述すること）</li>
        <li>&amp;を2つ以上連続して入力することは許可されません</li>
      </ul>
      {children}
    </>
  );
}
