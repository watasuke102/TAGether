// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './request.module.scss';
import SendIcon from '@assets/send.svg';
import CloseIcon from '@assets/close.svg';
import React from 'react';
import Button from '@/common/Button/Button';
import Loading from '@/common/Loading/Loading';
import TextForm from '@/common/TextForm/TextForm';
import Modal from '@/common/Modal/Modal';
import ButtonContainer from '@/common/Button/ButtonContainer';
import { Form } from '@/common/Form/Form';
import { useUser } from '@utils/api/user';
import { useRequestData, new_request, set_answer_to_request } from '@utils/api/request';

export default function Request(): React.ReactElement {
  const [request, SetRequest] = React.useState('');
  const [answer, set_answer] = React.useState('');
  const [opening_index, set_opening_edit_id] = React.useState<number | undefined>();
  const [requests, isLoading] = useRequestData();
  const [user, is_user_loading] = useUser();

  return (
    <div className={css.container}>
      <h1>要望一覧</h1>
      <p>
        要望一覧を回答付きで表示します。要望がある場合は気軽に投稿してください。他のユーザーに送信者を知られることはありませんが、ログには記録しているため、悪意のある迷惑行為などはお控えください。
      </p>
      <p>
        開発状況（ToDo）は<a href='https://0e0.pw/lusM'>こちら</a>
      </p>
      <p>
        以下の入力欄に要望を入力し、「送信」ボタンを押すことで送信できます。
      </p>
      <Form
        className={css.form}
        onSubmit={() => {
          if (request === '') return;
          new_request(request).then(() => SetRequest(''));
        }}
      >
        <TextForm label='要望入力欄' value={request} OnChange={e => SetRequest(e.target.value)} />
        <div className={css.button}>
          <Button icon={<SendIcon />} text='送信' variant='filled' type='submit' />
        </div>
      </Form>
      <hr />
      {isLoading || is_user_loading ? (
        <Loading />
      ) : (
        <section className={css.table_wrapper}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>最終更新</th>
                <th>内容</th>
                <th>回答</th>
                {user.is_admin && <th>編集</th>}
              </tr>
            </thead>
            <tbody>
              {requests
                .slice(0)
                .map((e, i) => {
                  const updated_at = e.updated_at.slice(0, -5).replace('T', ' ');
                  return (
                    <tr key={`req_${e.id}`}>
                      <td className={css.id}>{e.id}</td>
                      <td className={css.updated_at}>{updated_at}</td>
                      <td className={css.body}>{e.body}</td>
                      <td className={css.answer}>{e.answer}</td>
                      {user.is_admin && (
                        <td
                          className={css.edit_link}
                          onClick={() => {
                            set_opening_edit_id(i);
                            set_answer(e.answer);
                          }}
                        >
                          編集…
                        </td>
                      )}
                    </tr>
                  );
                })
                .reverse()}
            </tbody>
          </table>
        </section>
      )}
      <Modal isOpen={opening_index !== undefined} close={() => set_opening_edit_id(undefined)}>
        {opening_index !== undefined && requests?.at(opening_index ?? -1) ? (
          <Form
            className={css.modal}
            onSubmit={() =>
              set_answer_to_request(requests[opening_index].id, answer).then(() => set_opening_edit_id(undefined))
            }
          >
            <span className={css.req}>{requests[opening_index].body}</span>
            <TextForm label='回答' value={answer} oneline OnChange={e => set_answer(e.target.value)} />
            <ButtonContainer>
              <Button
                variant='material'
                text='閉じる'
                icon={<CloseIcon />}
                OnClick={() => {
                  set_opening_edit_id(undefined);
                }}
              />
              <Button variant='filled' text='回答を更新' icon={<SendIcon />} type='submit' />
            </ButtonContainer>
          </Form>
        ) : (
          <></>
        )}
      </Modal>
    </div>
  );
}
