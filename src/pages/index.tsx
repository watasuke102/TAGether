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
    req.onreadystatechange = () => {
      SetRequest('');
      SetIsModalOpen(true);
    }
    req.open('POST', process.env.API_URL + '/request.php?body='+request);
    req.send();
  }

  const modalData: ModalData = {
    isOpen: isModalOpen,
    close:  () => SetIsModalOpen(false),
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

      <h2>新機能</h2>
      <p>ショートカットキーに対応しました。</p>
      <ul>
        <li>Ctrl + Shift + (Lもしくは右矢印キー)： 答え合わせ・次の問題</li>
        <li>Ctrl + Shift + (Hもしくは左矢印キー)： 前の問題</li>
      </ul>

      <h2>既知の不具合</h2>
      <ul>
        <li>画面切り替えがおかしくなる</li>
        <li>カテゴリ新規作成および編集ページで、編集完了ウィンドウが表示されている状態でページを移動しようとした時、確認ダイアログが表示される</li>
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

      <h3>v1.1.9</h3>
      <p>ビルドできない問題を修正</p>

      <h3>v1.1.8</h3>
      <ul>
        <li>問題文が画面外にはみ出る問題が修正されたかもしれない</li>
        <li>ウィンドウの暗くなった部分をクリックして閉じることができるように</li>
        <li>問題編集ページで、先頭に追加できるように</li>
        <li>ショートカットキーに対応</li>
        <li>問題と解答の一覧ページを実装</li>
      </ul>

      <h3>v1.1.7</h3>
      <ul>
        <li>スマホでカテゴリ詳細とボタンが重なる問題を修正（たぶん）</li>
        <li>問題解答ページのレイアウトを修正、見やすくした</li>
        <li>検索欄のクリアボタンを追加</li>
        <li>その他ちょっとした見た目の修正</li>
      </ul>

      <h3>v1.1.6</h3>
      <ul>
        <li>ラジオボタンがはみ出て表示されてしまう不具合を修正</li>
        <li>カテゴリのタイトル/説明欄をスクロールできるようにした</li>
        <li>問題解答ページで、カテゴリ登録時に入力された改行をちゃんと反映させるようにした</li>
        <li>問題文で、改行のひとつ前の文字が消えてしまう問題を修正</li>
        <li>タグの登録数に制限を設けた（最大8個）</li>
      </ul>

      <p>
        以前のリリースは
        <a href='https://github.com/watasuke102/TAGether/releases'>こちら</a>
        から確認可能です。
      </p>

      <p className={css.version}>TAGether v1.1.9</p>

      <Modal {...modalData} />
    </div>
  );
}