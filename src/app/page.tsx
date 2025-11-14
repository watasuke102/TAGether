// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './top.module.scss';
import React from 'react';
import Link from 'next/link';
import Header from '@/features/Header/Header';
import PackageJson from 'package.json';
import {Login} from './_components/Login/Login';

export const TopPageSessionContext = React.createContext<() => void>(() => undefined);

// 本当はサーバーコンポーネントにしたかったが、
// セッション情報はクライアントのWebブラウザにあるのでだめそう
export default function Index(): React.ReactElement {
  // SWRの自動更新機能により、セッションが更新されて画面が更新される場合がある
  // （例：ユーザーがブラウザからフォーカスを外して、後で戻ってきた場合）
  // OTP入力後にこれが発生すると、パスキー登録の確認が消えてしまう
  // そのため、ここでは useSession() を使わず、自前でセッション確認を行う
  const [is_logged_in, set_is_logged_in] = React.useState<boolean | null>(null);
  const refresh_session = React.useCallback(() => {
    fetch('/api/session')
      .then(res => res.json())
      .then(async data => {
        set_is_logged_in(data.is_logged_in);
      });
  }, [set_is_logged_in]);

  React.useEffect(refresh_session, [refresh_session]);

  if (is_logged_in === null) {
    return (
      <>
        <Header />
        <span>Loading...</span>
      </>
    );
  }
  if (is_logged_in === false) {
    return (
      <TopPageSessionContext.Provider value={refresh_session}>
        <Login />
      </TopPageSessionContext.Provider>
    );
  }

  return (
    <>
      <Header />
      <div>
        <h1>ようこそ</h1>
        <p>
          「カテゴリ一覧」を選択して問題を解いてみましょう。
          <br />
          バグ・新機能の提案については<Link href='/request'> 「機能要望」ページ</Link>でお願いします。
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
          <li>Ctrl + Shift + L or → (右矢印キー)：次の問題・答え合わせ</li>
          <li>Ctrl + Shift + H or ← (左矢印キー)：前の問題</li>
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
          <li>Tab：1つ次の入力欄に移動</li>
          <li>Shift + Tab：1つ前の入力欄に移動</li>
          <li>SpaceもしくはEnter：（選択問題で）チェック状態の切り替え</li>
          <li>Ctrl + Shift + (Kもしくは上矢印キー)：（並び替え問題で）選択中の問題を1つ上に移動</li>
          <li>Ctrl + Shift + (Jもしくは下矢印キー)：（並び替え問題で）選択中の問題を1つ上に移動</li>
        </ul>

        <h2>既知の不具合</h2>
        <ul>
          <li>並び替え問題で、まれに並び替えができなくなる（情報求）</li>
        </ul>

        <p className={css.version}>TAGether v{PackageJson.version}</p>
      </div>
    </>
  );
}

function Releases(): JSX.Element {
  return (
    <>
      <h3>v3.0.0</h3>
      <ul>
        <li>新機能：Googleアカウントによるログイン</li>
        <ul>
          <li>履歴およびお気に入りを複数端末で共有できるようになります。</li>
          <li>これにより、以前の履歴を参照することができなくなりました。</li>
        </ul>
        <li>新しい問題形式：一覧からの選択問題</li>
        <li>新機能：カテゴリのCSV形式によるダウンロード</li>
        <ul>
          <li>WordHolicに対応したフォーマットでの出力も可能です。</li>
        </ul>
        <li>
          <Link href='/pp'>プライバシーポリシー</Link>を作成した
        </li>
        <li>全体的にModalの見た目を調節し、余白を小さくしたり幅を広げたりした</li>
        <li>機能要望において、横幅が十分に小さい端末では横にスクロールできるようにした</li>
        <li>WebHookの送信先を種類別に登録できるようにした</li>
        <li>お気に入り登録時のアニメーションを改善</li>
        <li>ヘッダーの高さなどを微調整した</li>
        <li>テキスト入力欄の高さを自動調節するようにした</li>
        <li>問題解答ページを作り直した</li>
        <li>Font Awesomeの利用をやめて、Google Fontsが提供するアイコンに移行</li>
        <li>編集画面のstateにuseReducerを使用するようにした</li>
        <li>drizzle・Vitestの導入</li>
        <li>バックエンドも含めてNext.jsのApp routerに移行した</li>
        <li>ドラッグ可能な項目をスマホで長押しした時、範囲選択が発生してしまった問題を修正</li>
        <li>カテゴリ一覧ページにおいて、ページ数がゴミ箱内のカテゴリも含めて計算されていた問題を修正 (#3)</li>
        <li>Ctrl+1～9で選択問題の変更をできるようにした</li>
        <li>apple-touch-iconを設定した</li>
      </ul>

      <h3>v2.1.0</h3>
      <ul>
        <li>問題数の合計が履歴に正しく反映されない問題を修正</li>
        <li>解答終了後のページ移動前確認を無効化</li>
        <li> 新機能：ゴミ箱 </li>
        <ul>
          <li>カテゴリ詳細ページ右上から、カテゴリをゴミ箱に移動させることが出来ます</li>
          <li>
            カテゴリ一覧ページ上部の「ゴミ箱内のカテゴリを表示」にチェックを入れることで、ゴミ箱に移動したカテゴリの閲覧・解答およびゴミ箱からの取り出しが可能です
          </li>
        </ul>
      </ul>

      <h3>v2.0.0</h3>
      <ul>
        <li>新機能：「解答時の設定」機能</li>
        <ul>
          <li>従来通りの「問題順をシャッフル」機能に加え、「選択問題の選択肢をシャッフル」を追加しました。</li>
          <li>
            解答する問題範囲を制限することが出来るようになりました。
            <br />
            3問目から7問目までの計5問を解く、といった設定が可能になります。
          </li>
        </ul>
        <li>改善：解答履歴（プロフィールページより）</li>
        <ul>
          <li>
            「解き直し」ボタンを削除しました。
            <br />
            今後解き直しを行う場合は、履歴からカテゴリ名をクリックして、
            表示されるカテゴリ詳細ウィンドウから「間違えた問題を解く」ボタンをクリックしてください。
            <br />
            また、前述の「解答時の設定」もカテゴリ詳細ウィンドウから行うことができます。
          </li>
          <li>
            同じタグが付けられた問題もしくは「解き直し」で間違えた問題を解いた後、回答履歴が残るようになりました。
            <br />
            これにより、解き直しで間違えた問題をまた解き直すことができます。
          </li>
          <li>
            自分の解答結果を一覧表示できるようになりました。従来は解答終了後にページを移動すると、その結果を再度見ることは不可能でした。
            <br />
            今後はプロフィールの解答履歴からカテゴリ詳細ウィンドウを開き、「間違えた問題一覧」ボタンで表示できます。
          </li>
          <li>これらの変更によって、今までの解答履歴との互換性がなくなりました。</li>
        </ul>
        <li>改善：デザイン</li>
        <ul>
          <li>カラーパレットを設定し、配色に一貫性をもたせました。</li>
          <li>ヘッダーのロゴを削除し、従来の「ホーム」ボタンと統合しました。</li>
          <li>フォントの weight を100増やしました（Light→Regular）。</li>
        </ul>
        <li>問題解答ページで、ページ切り替えショートカットが正常に動作しなかった問題を修正</li>
        <li>問題解答ページで、最初に並び替え問題が来た時、正常にソートできなかった問題を修正</li>
        <li>問題解答ページで、ショートカットによる並び替えができなかった問題を修正</li>
        <li>カテゴリ編集ページで、問題形式をショートカットで変更できるようにした</li>
        <li>カテゴリ編集ページで、Tabキーを押した際のフォーカス順を調整した</li>
        <li>カテゴリ編集ページで、複数選択問題を選んだ際、チェックが入っていなくても変更を保存できていた問題を修正</li>
        <li>
          カテゴリ作成時、モーダルで新しいカテゴリ名を受け取り、それをもとにカテゴリを作成してから編集ページに移動するようにした
        </li>
        <li>トースト通知をクリックして閉じることが出来るようにした</li>
        <li>問題一覧ページでコメントを表示できるようにした</li>
      </ul>

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
    </>
  );
}
