// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './Login.module.scss';
import React from 'react';
import Link from 'next/link';
import Button from '@/common/Button/Button';
import Logo from 'public/static/logo.svg';
import {useToastOperator} from '@/common/Toast/Toast';
import {Form} from '@/common/Form/Form';
import TextForm from '@/common/TextForm/TextForm';
import SendIcon from '@assets/send.svg';
import PasskeyIcon from '@assets/passkey.svg';
import {OtpSendRequest, OtpSendResponse} from 'src/app/api/auth/otp/send/route';
import {OtpVerifyRequest, OtpVerifyResponse} from 'src/app/api/auth/otp/verify/route';

async function request_otp(req: OtpSendRequest): Promise<Omit<OtpVerifyRequest, 'token'>> {
  const res = await fetch('/api/auth/otp/send', {
    method: 'POST',
    body: JSON.stringify(req),
    headers: {'Content-Type': 'application/json'},
  });
  const data: OtpSendResponse = await res.json();
  if ('error_message' in data) {
    throw Error(data.error_message);
  }
  return {
    email: req.email,
    id: data.id,
  };
}
async function verify_otp(req: OtpVerifyRequest): Promise<boolean> {
  const res = await fetch('/api/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify(req),
    headers: {'Content-Type': 'application/json'},
  });
  const data: OtpVerifyResponse = await res.json();
  if ('error_message' in data) {
    throw Error(data.error_message);
  }
  return data.is_verification_success;
}

async function 

export function Login() {
  const Toast = useToastOperator();
  const [state, set_state] = React.useState<'initial' | 'entered_email' | 'ask_register_passkey'>('initial');
  const [email, set_email] = React.useState('');
  const [otp_verify_request, set_otp_verify_request] = React.useState<Omit<OtpVerifyRequest, 'token'> | null>(null);
  const [otp, set_otp] = React.useState<string>('');

  return (
    <section className={css.container}>
      <div className={css.logo}>
        <Logo />
      </div>
      {(() => {
        switch (state) {
          case 'initial':
            return (
              <Form
                className={css.login_form}
                onSubmit={() =>
                  request_otp({email})
                    .then(res => {
                      set_otp_verify_request(res);
                      set_state('entered_email');
                    })
                    .catch(err => Toast.open(err.message))
                }
              >
                <TextForm
                  oneline
                  autoComplete='email webauthn'
                  id='login_email'
                  label='メールアドレス'
                  value={email}
                  OnChange={e => set_email(e.target.value)}
                />
                <Button icon={<SendIcon />} text='ログイン用メールを送信' variant='filled' type='submit' />
                <span className={css.or_separator}>または</span>
                <Button
                  icon={<PasskeyIcon />}
                  text='パスキーを用いてログイン'
                  variant='material'
                  OnClick={() => {
                    // TODO
                  }}
                />
              </Form>
            );
          case 'entered_email':
            return (
              <>
                <p className={css.waiting_email}>
                  入力されたメールアドレスにログイン用メールを送信しました。メールに記載されている認証コードを入力してください。
                </p>
                <Form
                  className={css.login_form}
                  onSubmit={() =>
                    verify_otp({
                      ...(otp_verify_request as Omit<OtpVerifyRequest, 'token'>),
                      token: otp,
                    })
                      .then(is_success => {
                        if (is_success) {
                          Toast.open('ログインに成功しました');
                          set_state('ask_register_passkey');
                        } else {
                          Toast.open('認証コードが正しくありません。再度お試しください。');
                          set_otp('');
                        }
                      })
                      .catch(err => Toast.open(err.message))
                  }
                >
                  <TextForm
                    oneline
                    id='login_otp'
                    label='認証コード'
                    value={otp}
                    OnChange={e => set_otp(e.target.value)}
                  />
                  <Button icon={<SendIcon />} text='ログイン' variant='filled' type='submit' />
                </Form>
              </>
            );
          case 'ask_register_passkey':
            return (
              <>
                <p>パスキー登録を行いますか？</p>
                <Button
                  text='パスキー登録を行う'
                  variant='filled'
                  OnClick={
                    () => {}
                    // TODO
                  }
                />
                <Button text='行わない' variant='material' OnClick={window?.location.reload ?? (() => undefined)} />
              </>
            );
        }
      })()}
      <div className={css.desc}>
        <p>
          学校から与えられているメールアドレスを用いてログインを行ってください。
          <br />
          ログインボタンを押下することで、<Link href='/pp'>プライバシーポリシー</Link>に同意したものとみなします。
        </p>
      </div>
    </section>
  );
}
