// TAGether - Share self-made exam for classmates
// top.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './top.module.scss';
import React from 'react';

export default function index(): React.ReactElement {
  return (
    <div>
      <h1>ようこそ</h1>
      <p>
        「カテゴリ一覧」を選択して問題を解いてみましょう。
        <br />
        バグ・新機能の提案については「機能要望」ページでお願いします。
        <br />
        サービス名はTAGether(たげざー)です
      </p>

      <details>
        <summary>更新履歴</summary>
        <Releases />
      </details>

      <p>
        以前のリリースは
        <a href='https://github.com/watasuke102/TAGether/releases'>こちら</a>
        から確認可能です。
      </p>

      <h2>ショートカットキーについて</h2>
      <p>問題解答ページ、カテゴリ編集ページで使用できます。</p>
      <ul>
        <li>Ctrl + Shift + (Lもしくは右矢印キー)： 答え合わせ・次の問題</li>
        <li>Ctrl + Shift + (Hもしくは左矢印キー)： 前の問題</li>
      </ul>

      <h2>既知の不具合</h2>
      <ul>
        <li>画面切り替えのアニメーション時、スタイルがリセットされる</li>
        <li>並び替え問題で、まれに並び替えができなくなる（情報求）</li>
      </ul>

      <p className={css.version}>TAGether v1.6.0</p>
    </div>
  );
}

function Releases(): React.ReactElement {
  return (
    <>
      <h3>v1.6.0</h3>
      <ul>
        <li>
          複数種類の問題形式を作成できるようになりました。
          <br />
          各問題にコメント（解説など）を追加できる他、 並び替え問題や4択問題のような問題を作成できます。
        </li>
        <li>プロフィールと機能要望の見た目をほんの少し変更</li>
      </ul>

      <h3>v1.5.2</h3>
      <p>ビルドできない問題を修正</p>

      <h3>v1.5.1</h3>
      <ul>
        <li>特定状況下でプロフィールが開けない問題を修正</li>
        <li>更新履歴を折りたたみ式にした</li>
        <li>タグ一覧で、タグが一つも存在しない際にメッセージを表示するように</li>
        <li>
          問題作成画面がリニューアルされました。従来のように複数の問題を一度に編集するのではなく、
          ページを切り替えて1問ずつ編集する方式になりました。
        </li>
      </ul>

      <h3>v1.5.0</h3>
      <div>
        <p>
          長いのでまとめると、
          <ul style={{margin: '0'}}>
            <li>解答履歴から間違えた問題だけ解けるようになったよ</li>
            <li>タグの追加方法が変わったよ</li>
            <li>特定のタグがついているカテゴリを全部まとめて解けるようになったよ</li>
            <li>機能要望をTAGetherから見れるようになったよ</li>
          </ul>
          という感じです
        </p>
        <ul>
          <li>スマホでいくつかのhover要素を無効化</li>
          <li>Reseter.cssを追加</li>
          <li>お気に入りボタンを押したとき、アニメーションするように</li>
          <li>新規作成/編集ページにてひとつ (上|下) に問題を追加するボタンを追加</li>
          <li>スマホでボタンの文字サイズを小さくした</li>
          <li>カテゴリ詳細ウィンドウでチェックボックスがボタンに隠れる問題を修正</li>
          <li>問題履歴から間違えた問題のみ解き直すことができるようになった</li>
          <li>最後まで解かずにページを移動した時、履歴を保存しないようにした</li>
          <li>バックエンドをExpressに移行</li>
          <li>機能要望ページを統合、機能要望送信フォームを移動</li>
          <li>モーダルウィンドウを閉じる際にもアニメーションするようにした</li>
          <li>タグ一覧ページを追加</li>
          <li>
            新規作成/編集ページで、タグ編集欄に既存のタグを追加できるタグピッカーを追加
            <br />
            （タグを半角スペースで区切って指定する方法は廃止されました）
          </li>
          <li>カテゴリカードのタグをクリックしたときに、タグの詳細を表示するように</li>
          <li>特定のタグが付与された問題をすべて解けるようになった</li>
          <li>jsonを直接編集できるようにした</li>
        </ul>
      </div>

      <h3>v1.4.0</h3>
      <ul>
        <li>カテゴリをお気に入り登録できるようにした</li>
        <li>解答したカテゴリの履歴（日付、正答率）が見れるように</li>
        <li>環境をdocker-composeへ移行</li>
      </ul>
      <p>お気に入り登録したカテゴリや解答履歴は、プロフィールから見ることが出来ます。</p>
    </>
  );
}
