// TAGether - Share self-made exam for classmates
// top.tsx
//
// CopyRight (c) 2020-2022 Watasuke
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
        <li>Ctrl + Shift + (Lもしくは右矢印キー)：次の問題・答え合わせ</li>
        <li>Ctrl + Shift + (Hもしくは左矢印キー)：前の問題</li>
      </ul>

      <p>カテゴリ編集ページのみ、以下のショートカットキーが使えます。</p>
      <ul>
        <li>Ctrl + S：編集結果の適用</li>
        <li>Ctrl + Shift + A：問題形式を「テキスト」に変更</li>
        <li>Ctrl + Shift + S：問題形式を「選択問題」に変更</li>
        <li>Ctrl + Shift + Z：問題形式を「複数選択」に変更</li>
        <li>Ctrl + Shift + X：問題形式を「並び替え」に変更</li>
      </ul>

      <p>問題解答ページのみ、以下のショートカットキーが使えます。</p>
      <ul>
        <li>Tab：一つ次の問題に移動</li>
        <li>Shift + Tab：一つ前の問題に移動</li>
        <li>SpaceもしくはEnter：（選択問題で）チェック状態の切り替え</li>
        <li>Ctrl + Shift + (Kもしくは上矢印キー)：（並び替え問題で）選択中の問題を1つ上に移動</li>
        <li>Ctrl + Shift + (Jもしくは下矢印キー)：（並び替え問題で）選択中の問題を1つ上に移動</li>
      </ul>

      <h2>既知の不具合</h2>
      <ul>
        <li>並び替え問題で、まれに並び替えができなくなる（情報求）</li>
      </ul>

      <p className={css.version}>TAGether v1.8.0</p>
    </div>
  );
}

function Releases(): JSX.Element {
  return (
    <>
      <h3>v1.8.0</h3>
      <ul>
        <li>編集中、存在しないページに移動しようとした時、問題を追加するようにした</li>
        <li>問題履歴の解答率の幅が狭すぎて改行されてしまう問題を修正</li>
        <li>空欄の問題を追加できるようになっていた問題を修正</li>
        <li>Ctrl+Sによる保存が正常に行えなかった問題を修正</li>
        <li>カテゴリ一覧のカードの見た目を調整</li>
        <li>カテゴリ一覧のカードがグリッドからズレている問題を修正</li>
        <li>カテゴリ一覧のカードを若干中央寄せにした</li>
        <li>複数選択問題で、答えをソートして表示するようにした</li>
        <li>解答中、ページ移動しようとしたときに警告を表示するようにした</li>
        <li>結果の共有ボタンを追加</li>
        <li>問題文付近の見た目を調整</li>
      </ul>

      <h3>v1.7.1</h3>
      <ul>
        <li>複数の正解がある問題で、強制的に間違い判定されてしまう現象を修正</li>
        <li>問題順がシャッフルされていなかった現象を修正</li>
        <li>最初に並び替え要素が来た時テキストが表示されなくなる現象</li>
        <li>問題編集ページでショートカットを押した時、反応しなかったりエラーになったりする現象を修正</li>
        <li>使用できない記号が含まれているカテゴリを登録できないようにした</li>
        <li>チェックボタンにフォーカスしてEnter/Spaceを押すと状態変化するように</li>
        <li>並び替え問題でCtrl+Shift+[J/K]で上下に入れ替えできるようにした</li>
        <li>カテゴリ・解答履歴の表示件数に制限を設け、ページ切り替えができるように</li>
        <li>複数選択で正解しても履歴に不正解として残る現象を修正</li>
        <li>解答履歴の見た目を変更（1つずつ削除できるようにした）</li>
        <li>編集画面においてCtrl+Sで保存できるようにした</li>
      </ul>

      <h3>v1.7.0</h3>
      <ul>
        <li>問題編集後、タグに空要素が挿入されてしまう問題を修正</li>
        <li>問題の文字数が多い時はみ出てしまう問題を修正</li>
        <li>入力欄のスペルチェックを無効化</li>
        <li>ページ移動時のアニメーションを変更（プログレスバーに）</li>
        <li>何か編集されたときのみ画面移動時の警告を表示するように修正</li>
        <li>間違えた問題を強調表示できるようにした</li>
        <li>PWAに対応しました。 インストールすることにより、一部オフライン環境での動作ができるかもしれません。</li>
      </ul>

      <h3>v1.6.0</h3>
      <ul>
        <li>
          複数種類の問題形式を作成できるようになりました。
          <br />
          各問題にコメント（解説など）を追加できる他、 並び替え問題や4択問題のような問題を作成できます。
        </li>
        <li>プロフィールと機能要望の見た目をほんの少し変更</li>
      </ul>
    </>
  );
}
