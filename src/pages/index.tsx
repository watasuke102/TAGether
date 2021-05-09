// TAGether - Share self-made exam for classmates
// index.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/index.module.scss';
import React from 'react';
import Form from '../components/Form';
import Modal from '../components/Modal';
import Button from '../components/Button';
import ModalData from '../types/ModalData';

export default function index() {
  const [request, SetRequest] = React.useState('');
  const [isModalOpen, SetIsModalOpen] = React.useState(false);

  const SendRequest = () => {
    if (request == '') return;
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      SetRequest('');
      SetIsModalOpen(true);
    }
    req.open('POST', process.env.API_URL + '/request.php?body=' + request);
    req.send();
  }

  const modalData: ModalData = {
    isOpen: isModalOpen,
    close: () => SetIsModalOpen(false),
    body: (
      <div className={css.window}>
        <p>送信しました。<br />ご協力ありがとうございます。</p>
        <Button {...{
          type: 'filled', icon: 'fas fa-times', text: '閉じる',
          onClick: () => SetIsModalOpen(false)
        }} />
      </div>
    )
  }

  return (
    <div>
      <h1>ようこそ</h1>
      <p>
        「カテゴリ一覧」を選択して問題を解いてみましょう。<br />
        不満があれば、下の「機能要望」へお願いします。
      </p>
      <p>
        サービス名はTAGether(たげざー)です。<br />
        開発状況（ToDo）は<a href="https://0e0.pw/lusM">こちら</a>
      </p>

      <h2>ショートカットキーについて</h2>
      <ul>
        <li>Ctrl + Shift + (Lもしくは右矢印キー)： 答え合わせ・次の問題</li>
        <li>Ctrl + Shift + (Hもしくは左矢印キー)： 前の問題</li>
      </ul>

      <h2>既知の不具合</h2>
      <ul>
        <li>画面切り替えがおかしくなる</li>
      </ul>

      <h2>機能要望</h2>
      <p>Webサービスなんもわからないので、意見がほしいです</p>
      <p>スマホでここが押しづらいとか、表示がわかりにくい等、不満があれば<b>全部</b>書いてください</p>
      <p>機能要望は<a href="https://api.watasuke.tk/show_request.php">こちら</a>から閲覧可能です</p>
      <div className={css.form}>
        <Form {...{
          label: '意見', value: request, rows: 10,
          onChange: (e) => SetRequest(e.target.value)
        }} />
        <div className={css.button}> <Button {...{
          icon: 'fas fa-paper-plane', text: '送信', type: 'filled',
          onClick: SendRequest
        }} /> </div>
      </div>

      <h2>更新履歴</h2>

      <h3>v1.3.2</h3>
      <ul>
        <li>解答状況一覧にカテゴリタイトルと正答率を表示するようにした</li>
        <li>カテゴリ詳細ウィンドウの高さの指定方法を変更（スマホで見やすくなったかも）</li>
        <li>モーダルウィンドウ表示時アニメーションの挙動を修正</li>
        <li>
          既知の不具合を修正 <br />
          「カテゴリ新規作成および編集ページで、編集完了ウィンドウが表示されている状態でページを移動しようとした時、確認ダイアログが表示される」
        </li>

      </ul>

      <h3>v1.3.1</h3>
      <ul>
        <li>カテゴリ削除を出来ないようにした</li>
        <li>開発状況（ToDo）を公開</li>
      </ul>

      <h3>v1.3.0</h3>
      <ul>
        <li>アニメーションの時間を少し短くした</li>
        <li>解答後の一覧で、存在しない解答欄が表示されていた問題（合計2問しかないのに3問目の入力が表示されていた）を修正</li>
        <li>間違えた問題の正しい答えが赤色でハイライトされるように</li>
        <li>複数種類の正解を作ることができるように<br />
        （問題作成ページで解答"A&B"のように&で区切ると、AもしくはBのどちらかが入力された際に正解になります）
        </li>
        <li>解答状況一覧で、上から全問不正解→部分正解→全問正解の順に並べ替えて表示されるようになった</li>
      </ul>

      <p>
        以前のリリースは
        <a href='https://github.com/watasuke102/TAGether/releases'>こちら</a>
        から確認可能です。
      </p>

      <p className={css.version}>TAGether v1.3.2</p>

      <Modal {...modalData} />
    </div>
  );
}