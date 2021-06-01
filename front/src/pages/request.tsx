// TAGether - Share self-made exam for classmates
// index.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/request.module.scss';
import React from 'react';
import { GetServerSideProps } from 'next';
import Form from '../components/Form';
import Modal from '../components/Modal';
import Button from '../components/Button';
import GetFromApi from '../ts/Api';
import ModalData from '../types/ModalData';
import FeatureRequest from '../types/FeatureRequest';
import ApiResponse from '../types/ApiResponse';

interface Props { requests: FeatureRequest[] }

export default function Request({ requests }: Props): React.ReactElement {
  const [request, SetRequest] = React.useState('');
  const [isModalOpen, SetIsModalOpen] = React.useState(false);
  const [result, SetResult] = React.useState({ isSuccess: false, result: '' });

  const SendRequest = () => {
    if (request == '') return;
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        const result = JSON.parse(req.responseText);
        if (result.isSuccess) {
          SetRequest('');
        }
        SetResult(result);
        SetIsModalOpen(true);
      }
    };
    req.open('POST', process.env.EDIT_URL + '/request');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({ body: request }));
  };

  const modalData: ModalData = {
    isOpen: isModalOpen,
    close: () => SetIsModalOpen(false),
    body: (
      <div className={css.window}>
        {result.isSuccess ?
          <p>
            送信しました。ご協力ありがとうございます。<br />
            ページを再読み込みすることで要望一覧が更新されます。
          </p>
          :
          <p>
            送信に失敗しました: {result.result}<br />
            しばらく時間を置いてもう一度送信してください。
          </p>
        }
        <Button {...{
          type: 'filled', icon: 'fas fa-times', text: '閉じる',
          onClick: () => SetIsModalOpen(false)
        }} />
      </div>
    )
  };

  // 要望一覧
  const list: React.ReactElement[] = [];
  requests.map(e => {
    const updated_at = e.updated_at
      .slice(0, -5)
      .replace('T', ' ');
    list.push(
      <tr key={`req_${e.id}`}>
        <td className={css.id}>{e.id}</td>
        <td className={css.updated_at}>{updated_at}</td>
        <td className={css.body}>{e.body}</td>
        <td className={css.answer}>{e.answer}</td>
      </tr>
    );
  });

  return (
    <div className={css.container}>
      <h1>要望一覧</h1>
      <p>要望一覧を回答付きで表示します。荒らしや迷惑な内容は削除します。</p>
      <p>開発状況（ToDo）は<a href='https://0e0.pw/lusM'>こちら</a></p>

      {/* 機能要望の送信フォーム */}
      <p>
        もし要望がある場合は、気軽に投稿してください。<br />
        以下の入力欄に要望を入力し、「送信」ボタンを押すことで送信できます。
      </p>
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

      <hr />

      <table><tbody>
        <tr>
          <th>ID</th><th>最終更新</th><th>内容</th><th>回答</th>
        </tr>
        {list}
      </tbody></table>

      <Modal {...modalData} />
    </div>
  );
}

// APIで問題を取得
export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await GetFromApi<FeatureRequest>('request', context.query.id);
  return { props: { requests: data } };
};