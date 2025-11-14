// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import React from 'react';
import {mutate} from 'swr';
import {redirect} from 'next/navigation';
import {Session} from '@mytypes/Session';
import {fetcher, useApiData} from './common';

const session_key = '/api/session';

export function reflesh_session() {
  mutate(session_key);
}

export async function logout(): Promise<void> {
  await fetcher(`${session_key}/logout`, {method: 'POST'});
  mutate(session_key);
}

export function useSession(use_redirect?: boolean): [Session, boolean, boolean] {
  const data = useApiData<Session>(session_key);

  React.useEffect(() => {
    if (data[1]) {
      return;
    }
    if (use_redirect && !data[0].is_logged_in) {
      redirect('/');
    }
  }, [data, use_redirect]);

  return data;
}
