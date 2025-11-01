// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { Session } from '@mytypes/Session';
import { env } from 'env';

export type LoginData = {
  uid: string;
  email: string;
};
export async function POST(): Promise<Response> {
  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  session.destroy();
  return Response.json({});
}
