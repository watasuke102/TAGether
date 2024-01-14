// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import React from 'react';
import axios from 'axios';
import {mutate} from 'swr';
import {useApiData} from './common';
import {redirect} from 'next/navigation';
import {Session} from '@mytypes/Session';

const session_key = '/api/session';

export async function login(uid: string, email: string): Promise<void> {
  console.info('[login]', {uid, email});
  const res = await axios.post(`${session_key}/login`, JSON.stringify({uid, email}), {
    headers: {'Content-Type': 'application/json'},
  });
  if (res.data.message) {
    throw Error(res.data.message);
  }
  mutate(session_key);
}

export async function logout(): Promise<void> {
  await axios.post(`${session_key}/logout`);
  mutate(session_key);
}

export function useSession(use_redirect?: boolean): [Session, boolean, boolean] {
  const data = useApiData<Session>(session_key)();

  React.useEffect(() => {
    if (data[1]) {
      return;
    }
    if (use_redirect && !data[0].is_logged_in) {
      redirect('/');
    }
  }, [data]);

  return data;
}
