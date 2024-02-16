// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './Login.module.scss';
import React from 'react';
import Link from 'next/link';
import {GoogleOAuthProvider, useGoogleLogin, useGoogleOneTapLogin} from '@react-oauth/google';
import Button from '@/common/Button/Button';
import GoogleIcon from '@assets/google.svg';
import Logo from 'public/static/logo.svg';
import {env} from 'env';
import {jwtDecode} from 'jwt-decode';
import {useToastOperator} from '@/common/Toast/Toast';
import {login} from '@utils/api/session';

function Main(): JSX.Element {
  const Toast = useToastOperator();
  const handle_login = e => login(e.sub, e.email).catch(e => Toast.open(e.toString()));
  const google_login = useGoogleLogin({
    onSuccess: res => {
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${res.access_token}`,
        },
      })
        .then(e => e.json())
        .then(handle_login);
    },
    onError: () => Toast.open('ログインに失敗しました。\nインターネット接続を確認し、一定時間後にやり直してください。'),
    flow: 'implicit',
  });
  useGoogleOneTapLogin({
    onSuccess: data => handle_login(jwtDecode(data.credential ?? '')),
    onError: () => Toast.open('ログインに失敗しました。\nインターネット接続を確認し、一定時間後にやり直してください。'),
  });

  const is_enabled_detour_login = process.env.NODE_ENV === 'development' && env.DISABLE_LOGIN_FEATURE_ON_DEVELOPING;

  return (
    <section className={css.container}>
      <div className={css.logo}>
        <Logo />
      </div>
      <Button
        type='filled'
        icon={<GoogleIcon />}
        text={is_enabled_detour_login ? 'ゲストとしてログイン（開発用）' : 'Googleアカウントでログイン'}
        OnClick={is_enabled_detour_login ? () => login('guest', 'guest') : google_login}
      />
      <span>学校から与えられているGoogleアカウントを用いてログインを行ってください。</span>
      <span>
        ログインボタンを押下することで、<Link href='/pp'>プライバシーポリシー</Link>に同意したものとみなします。
      </span>
    </section>
  );
}

export function Login(): JSX.Element {
  return (
    <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
      <Main />
    </GoogleOAuthProvider>
  );
}
