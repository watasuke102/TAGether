// TAGether - Share self-made exam for classmates
// top.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../styles/top.module.scss';
import React from 'react';
import Form from '../components/Form';
import Modal from '../components/Modal';
import Button from '../components/Button';
import ModalData from '../types/ModalData';

export default function top(): React.ReactElement {
  const [request, SetRequest] = React.useState('');
  const [isModalOpen, SetIsModalOpen] = React.useState(false);

  const SendRequest = () => {
    if (request == '') return;
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      SetRequest('');
      SetIsModalOpen(true);
    };
    req.open('POST', process.env.API_URL + '/request.php?body=' + request);
    req.send();
  };

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
  };

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
          onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => SetRequest(e.target.value)
        }} />
        <div className={css.button}> <Button {...{
          icon: 'fas fa-paper-plane', text: '送信', type: 'filled',
          onClick: SendRequest
        }} /> </div>
      </div>

      <h2>更新履歴</h2>

      <h3>v1.4.0</h3>
      <ul>
        <li>カテゴリをお気に入り登録できるようにした</li>
        <li>解答したカテゴリの履歴（日付、正答率）が見れるように</li>
        <li>環境をdocker-composeへ移行</li>
      </ul>
      <p>お気に入り登録したカテゴリや解答履歴は、プロフィールから見ることが出来ます。</p>

      <h3>v1.3.3</h3>
      <ul>
        <li>WebKitで新規追加・編集画面を開けない問題を修正</li>
        <li>問題編集画面で保存したとき、モーダルウィンドウではなくトースト通知を出すように</li>
        <li>解答状況一覧で、カテゴリ名や正答率がスクロールに追従するように</li>
        <li>チェックボックスのコンポーネントを自作のものにした</li>
        <li>問題一覧で、正解を非表示に出来るようにした</li>
      </ul>

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

      <p>
        以前のリリースは
        <a href='https://github.com/watasuke102/TAGether/releases'>こちら</a>
        から確認可能です。
      </p>

      <p className={css.version}>TAGether v1.4.0</p>

      <Modal {...modalData} />
    </div>
  );
}