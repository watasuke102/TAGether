// TAGether - Share self-made exam for classmates
// request.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './request.module.scss';
import React from 'react';
import Helmet from 'react-helmet';
import Form from '@/common/TextForm/Form';
import Toast from '@/common/Toast/Toast';
import Button from '@/common/Button/Button';
import FeatureRequest from '@mytypes/FeatureRequest';

interface Props {
  requests: FeatureRequest[];
}

export default function Request({requests}: Props): React.ReactElement {
  const [request, SetRequest] = React.useState('');
  const router = useRouter();

  const SendRequest = () => {
    if (request == '') return;
    const req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState == 4) {
        router.reload();
      }
    };
    req.open('POST', process.env.EDIT_URL + '/request');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({body: request}));
  };

  // 要望一覧
  const list: React.ReactElement[] = [];
  requests.map(e => {
    const updated_at = e.updated_at.slice(0, -5).replace('T', ' ');
    list.push(
      <tr key={`req_${e.id}`}>
        <td className={css.id}>{e.id}</td>
        <td className={css.updated_at}>{updated_at}</td>
        <td className={css.body}>{e.body}</td>
        <td className={css.answer}>{e.answer}</td>
      </tr>,
    );
  });

  return (
    <div className={css.container}>
      <Helmet title='機能要望 - TAGether' />
      <h1>要望一覧</h1>
      <p>要望一覧を回答付きで表示します。荒らしや迷惑な内容は削除します。</p>
      <p>
        開発状況（ToDo）は<a href='https://0e0.pw/lusM'>こちら</a>
      </p>

      {/* 機能要望の送信フォーム */}
      <p>
        もし要望がある場合は、気軽に投稿してください。
        <br />
        以下の入力欄に要望を入力し、「送信」ボタンを押すことで送信できます。
      </p>
      <div className={css.form}>
        <Form
          {...{
            label: '意見',
            value: request,
            rows: 10,
            onChange: e => SetRequest(e.target.value),
          }}
        />
        <div className={css.button}>
          {' '}
          <Button
            {...{
              icon: 'fas fa-paper-plane',
              text: '送信',
              type: 'filled',
              onClick: SendRequest,
            }}
          />{' '}
        </div>
      </div>

      <hr />

      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <th>最終更新</th>
            <th>内容</th>
            <th>回答</th>
          </tr>
        </table>
          )}
        </div>
      </Toast>
    </div>
  );
}
