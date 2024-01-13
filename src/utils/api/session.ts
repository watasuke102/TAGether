// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import axios from 'axios';
import {useApiData} from './common';
import {Session} from '@mytypes/Session';
import {mutate} from 'swr';

const user_key = '/api/session';

export async function login(uid: string, email: string): Promise<void> {
  console.info('[login]', {uid, email});
  const res = await axios.post(`${user_key}/login`, JSON.stringify({uid, email}), {
    headers: {'Content-Type': 'application/json'},
  });
  if (res.data.message) {
    throw Error(res.data.message);
  }
  mutate(user_key);
}

export const useSession = useApiData<Session>(user_key);
