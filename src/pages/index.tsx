// TAGether - Share self-made exam for classmates
// index.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/index.module.css';
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
    req.open('POST', process.env.API_URL + '/request.php?body='+request);
    req.send();
    SetIsModalOpen(false);
  }

  const modalData: ModalData = {
    isOpen: isModalOpen,
    body: (
      <div className={css.window}>
        <p>送信しました。<br/>ご協力ありがとうございます。</p>
        <Button {...{
          type: 'filled', icon: 'fas fa-times', text: '閉じる',
          onClick: () => SetIsModalOpen(false)
        }} />
      </div>
    )
  }

  return(
    <div>
      <h1>ようこそ</h1>
      <p>「カテゴリ一覧」を選択して問題を解いてみましょう。</p>
      <p>不満があれば、下の「機能要望」へお願いします。</p>

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

      <h3>v1.1.4</h3>
      <p>ビルドできない問題を修正</p>

      <h3>v1.1.3</h3>
      <ul>
        <li>カテゴリの作成/編集ページで、カテゴリの追加/編集に成功したら
          ページ移動確認ダイアログを表示しないようにした</li>
        <li>カテゴリの検索機能を追加</li>
      </ul>

      <h3>v1.1.2</h3>
      <ul>
        <li>スマホでのヘッダー周りの挙動を修正</li>
        <li>問題の順番をシャッフルできるようにした</li>
      </ul>

      <p className={css.version}>TAGether v1.1.4</p>

      <Modal {...modalData} />
    </div>
  );
}