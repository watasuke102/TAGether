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

function SendRequest(s: string, func: Function) {
  if (s == '') return;
  const req = new XMLHttpRequest();
  req.onreadystatechange = () => {
    if (req.readyState == 4) {
      console.log(req.statusText);
    }
  }
  req.open('POST', 'https://api.watasuke.tk/request.php?body='+s);
  req.send();
  func();
}

export default function index() {
  const [request, SetRequest] = React.useState('');
  const [isModalOpen, SetIsModalOpen] = React.useState(false);

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
      <p>不満があれば、以下の「機能要望」へお願いします。</p>

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

      <h2>既知の不具合</h2>
      <ul>
        <li>画面切り替えがおかしくなる</li>
      </ul>

      <h2>機能要望</h2>
      <p>Webサービスなんもわからないので、意見がほしいです</p>
      <p>スマホでここが押しづらいとか、表示がわかりにくい等、不満があれば<b>全部</b>書いてください</p>
      <p>連絡が必要であればTeamsアカウントなりTwitter IDなりを書いといてください</p>
      <div className={css.form}>
        <Form {...{
          label: '意見', value: request, rows: 10,
          onChange: (e) => SetRequest(e.target.value)
        }} />
        <div className={css.button}> <Button {...{
          icon: 'fas fa-paper-plane', text: '送信', type: 'filled',
          onClick: () => SendRequest(request, () => SetIsModalOpen(true))
        }} /> </div>
      </div>
      </form>

      <Modal {...modalData} />
    </div>
  );
}