// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './Login.module.scss';
import Logo from 'public/static/logo.svg';
import SendIcon from '@assets/send.svg';
import PasskeyIcon from '@assets/passkey.svg';
import ArrowRightIcon from '@assets/arrow-right.svg';
import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {PublicKeyCredentialRequestOptionsJSON, startAuthentication, startRegistration} from '@simplewebauthn/browser';
import Button from '@/common/Button/Button';
import {useToastOperator} from '@/common/Toast/Toast';
import {Form} from '@/common/Form/Form';
import TextForm from '@/common/TextForm/TextForm';
import {OtpSendRequest, OtpSendResponse} from 'src/app/api/auth/otp/send/route';
import {OtpVerifyRequest, OtpVerifyResponse} from 'src/app/api/auth/otp/verify/route';
import {PasskeyLoginVerifyRequest, PasskeyLoginVerifyResponse} from 'src/app/api/auth/passkey/login/verify/route';
import {PasskeyRegisterOptionsRequest} from 'src/app/api/auth/passkey/register/options/route';
import {TopPageSessionContext} from 'src/app/page';
import {
  OneTimePasswordField,
  OneTimePasswordFieldHiddenInput,
  OneTimePasswordFieldInput,
} from '@radix-ui/react-one-time-password-field';

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

async function register_passkey(email: string): Promise<void> {
  const options_res = await fetch('/api/auth/passkey/register/options', {
    method: 'POST',
    body: JSON.stringify({email} as PasskeyRegisterOptionsRequest),
    headers: {'Content-Type': 'application/json'},
  });
  const options: PublicKeyCredentialJSON = await options_res.json();
  if ('error_message' in options) {
    throw Error(options.error_message);
  }
  const attestation_response = await startRegistration({optionsJSON: options});
  const res = await fetch('/api/auth/passkey/register/verify', {
    method: 'POST',
    body: JSON.stringify({
      email,
      challenge: options.challenge,
      attestation_response,
    } as PasskeyRegisterOptionsRequest),
  });
  const data: PasskeyLoginVerifyResponse = await res.json();
  if ('error_message' in data) {
    throw Error(data.error_message);
  }
}
async function auth_passkey(useBrowserAutofill: boolean): Promise<void> {
  const options_res = await fetch('/api/auth/passkey/login/options', {method: 'POST'});
  const options: PublicKeyCredentialRequestOptionsJSON = await options_res.json();
  const auth_response = await startAuthentication({
    optionsJSON: options,
    useBrowserAutofill,
  });
  const verify_res = await fetch('/api/auth/passkey/login/verify', {
    method: 'POST',
    body: JSON.stringify({
      challenge: options.challenge,
      auth_response,
    } as PasskeyLoginVerifyRequest),
  });
  const verify_data: PasskeyLoginVerifyResponse = await verify_res.json();
  if ('error_message' in verify_data) {
    throw new Error(verify_data.error_message);
  }
}

export function Login() {
  const Toast = useToastOperator();
  const [state, set_state] = React.useState<'initial' | 'entered_email' | 'ask_register_passkey'>('initial');
  const [email, set_email] = React.useState('');
  const [pending, set_pending] = React.useState(false);
  const [otp_verify_request, set_otp_verify_request] = React.useState<Omit<OtpVerifyRequest, 'token'> | null>(null);
  const [otp, set_otp] = React.useState<string>('');

  const refresh_session = React.useContext(TopPageSessionContext);

  const router = useRouter();
  React.useEffect(() => {
    (async () => {
      if (!window || !window.PublicKeyCredential) {
        return;
      }
      const is_available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!router || !is_available) {
        return;
      }
      try {
        await auth_passkey(true);
        refresh_session();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {}
    })();
  }, [router, refresh_session]);

  return (
    <div className={css.container}>
      <div className={css.logo}>
        <Logo />
      </div>
      {(() => {
        switch (state) {
          case 'initial':
            return (
              <Form
                className={css.login_area}
                onSubmit={() => {
                  set_pending(true);
                  request_otp({email})
                    .then(res => {
                      set_otp_verify_request(res);
                      set_state('entered_email');
                    })
                    .catch(err => Toast.open(err.message))
                    .finally(() => set_pending(false));
                }}
              >
                <TextForm
                  oneline
                  autoComplete='email webauthn'
                  id='login_email'
                  label='メールアドレス'
                  value={email}
                  disabled={pending}
                  OnChange={e => set_email(e.target.value)}
                />
                <Button
                  icon={<SendIcon />}
                  text='ログイン用メールを送信'
                  variant='filled'
                  type='submit'
                  disabled={pending}
                />
                <span className={css.or_separator}>または</span>
                <Button
                  icon={<PasskeyIcon />}
                  text='パスキーを用いてログイン'
                  variant='material'
                  disabled={true || pending}
                  OnClick={() => {
                    set_pending(true);
                    auth_passkey(false)
                      .then(refresh_session)
                      .catch(err => Toast.open(err.message))
                      .finally(() => set_pending(false));
                  }}
                />
                <div className={css.desc}>
                  <p>
                    学校から与えられているメールアドレスを用いてログインしてください。
                    <br />
                    ログインボタンを押下することで、<Link href='/pp'>プライバシーポリシー</Link>
                    に同意したものとみなします。
                  </p>
                </div>
              </Form>
            );
          case 'entered_email':
            return (
              <div className={css.waiting_email}>
                <p className={css.waiting_email_message}>
                  入力されたメールアドレスにログイン用メールを送信しました。メールに記載されている認証コードを入力してください。
                </p>
                <OneTimePasswordField
                  className={css.waiting_email_otp_field}
                  value={otp}
                  onValueChange={set_otp}
                  autoFocus
                  autoSubmit
                  onAutoSubmit={e => {
                    set_pending(true);
                    verify_otp({
                      ...(otp_verify_request as Omit<OtpVerifyRequest, 'token'>),
                      token: e,
                    })
                      .then(is_success => {
                        if (is_success) {
                          Toast.open('ログインに成功しました');
                          set_state('ask_register_passkey');
                        } else {
                          Toast.open('認証コードが正しくありません。再度お試しください。');
                        }
                      })
                      .catch(err => Toast.open(err.message))
                      .finally(() => {
                        set_otp('');
                        set_pending(false);
                      });
                  }}
                >
                  <OneTimePasswordFieldInput className={css.waiting_email_otp_input} />
                  <OneTimePasswordFieldInput className={css.waiting_email_otp_input} />
                  <OneTimePasswordFieldInput className={css.waiting_email_otp_input} />
                  <OneTimePasswordFieldInput className={css.waiting_email_otp_input} />
                  <OneTimePasswordFieldInput className={css.waiting_email_otp_input} />
                  <OneTimePasswordFieldInput className={css.waiting_email_otp_input} />
                  <OneTimePasswordFieldHiddenInput />
                </OneTimePasswordField>
              </div>
            );
          case 'ask_register_passkey':
            return (
              <div className={css.ask_passkey_register}>
                <p>パスキー登録を行いますか？</p>
                <Button
                  text='パスキー登録を行う'
                  variant='filled'
                  icon={<PasskeyIcon />}
                  disabled={pending}
                  OnClick={() => {
                    set_pending(true);
                    register_passkey(email)
                      .then(refresh_session)
                      .catch(err => Toast.open(err.message))
                      .finally(() => set_pending(false));
                  }}
                />
                <Button text='行わない' variant='material' icon={<ArrowRightIcon />} OnClick={refresh_session} />
              </div>
            );
        }
      })()}
    </div>
  );
}
