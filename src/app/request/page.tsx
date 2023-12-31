// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './request.module.scss';
import React from 'react';
import Helmet from 'react-helmet';
import Button from '@/common/Button/Button';
import Loading from '@/common/Loading/Loading';
import Form from '@/common/TextForm/Form';
import {useRequestData, new_request, mutate_request} from '@utils/api/request';
import SendIcon from '@assets/send.svg';

export default function Request(): React.ReactElement {
  const [request, SetRequest] = React.useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [requests, isLoading] = useRequestData();

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
        <Form label='要望入力欄' value={request} OnChange={e => SetRequest(e.target.value)} />
        <div className={css.button}>
          <Button
            icon={<SendIcon />}
            text='送信'
            type='filled'
            OnClick={() => {
              if (request === '') return;
              new_request(request).then(() => {
                SetRequest('');
                mutate_request();
              });
            }}
          />
        </div>
      </div>
      <hr />
      {isLoading ? (
        <Loading />
      ) : (
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>最終更新</th>
              <th>内容</th>
              <th>回答</th>
            </tr>
            {requests
              .slice(0)
              .reverse()
              .map(e => {
                const updated_at = e.updated_at.slice(0, -5).replace('T', ' ');
                return (
                  <tr key={`req_${e.id}`}>
                    <td className={css.id}>{e.id}</td>
                    <td className={css.updated_at}>{updated_at}</td>
                    <td className={css.body}>{e.body}</td>
                    <td className={css.answer}>{e.answer}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </div>
  );
}
