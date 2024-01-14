// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {getIronSession} from 'iron-session';
import {redirect} from 'next/navigation';
import {cookies} from 'next/headers';
import {Session} from '@mytypes/Session';
import {env} from 'env';

export async function require_session_or_redirect(): Promise<void> {
  const session = await getIronSession<Session>(cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    redirect('/');
  }
}
