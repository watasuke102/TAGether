// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './request.module.scss';
import React from 'react';
import Button from '@/common/Button/Button';
import Loading from '@/common/Loading/Loading';
import Form from '@/common/TextForm/Form';
import Modal from '@/common/Modal/Modal';
import ButtonContainer from '@/common/Button/ButtonContainer';
import {useUser} from '@utils/api/user';
import {useRequestData, new_request, set_answer_to_request} from '@utils/api/request';
import SendIcon from '@assets/send.svg';
import CloseIcon from '@assets/close.svg';

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
        要望一覧を回答付きで表示します。 もし要望がある場合は、気軽に投稿してください。 荒らしや迷惑な内容は削除します。
      </p>
      <p>
        開発状況（ToDo）は<a href='https://0e0.pw/lusM'>こちら</a>
      </p>
      <p>
        以下の入力欄に要望を入力し、「送信」ボタンを押すことで送信できます。
        <br />
        送信者が特定できるような情報は保存されません。個別対応が必要な際は要望内にその旨を含めてください。
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
              new_request(request).then(() => SetRequest(''));
            }}
          />
        </div>
      </div>
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
          <div className={css.modal}>
            <span className={css.req}>{requests[opening_index].body}</span>
            <Form label='回答' value={answer} OnChange={e => set_answer(e.target.value)} />
            <ButtonContainer>
              <Button
                type='material'
                text='閉じる'
                icon={<CloseIcon />}
                OnClick={() => {
                  set_opening_edit_id(undefined);
                }}
              />
              <Button
                type='filled'
                text='回答を更新'
                icon={<SendIcon />}
                OnClick={() => {
                  set_answer_to_request(requests[opening_index].id, answer).then(() => set_opening_edit_id(undefined));
                }}
              />
            </ButtonContainer>
          </div>
        ) : (
          <></>
        )}
      </Modal>
    </div>
  );
}
