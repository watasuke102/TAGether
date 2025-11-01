// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import { getIronSession } from 'iron-session';
import { Session } from '@mytypes/Session';
import { cookies } from 'next/headers';
import { env } from 'env';

export async function GET(): Promise<Response> {
  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  if (session.is_logged_in !== true) {
    return Response.json({ is_logged_in: false });
  }
  return Response.json(session);
}
