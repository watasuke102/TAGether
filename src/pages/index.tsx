// TAGether - Share self-made exam for classmates
// index.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react';

export default function index() {
  return(
    <div>
      <h1>ようこそ</h1>
      <p>「カテゴリ一覧」を選択して問題を解いてみましょう。</p>

      <h2>機能について</h2>
      <p>以下の機能は未実装ですが、（やる気があれば）実装される予定です。</p>
      <ul>
        <li>プロフィール</li>
        <li>ログイン処理</li>
        <li>問題の解答履歴（得点など）</li>
        <li>カテゴリの編集機能</li>
        <li>カテゴリのお気に入り設定</li>
        <li>その他こまかいとこ</li>
      </ul>
    </div>
  );
}