// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {history} from 'src/db/schema';
import {connect_drizzle} from 'src/db/drizzle';
import {getIronSession} from 'iron-session';
import {Session} from '@mytypes/Session';
import {cookies} from 'next/headers';
import {env} from 'env';
import {eq} from 'drizzle-orm';

export async function GET(_: Request, {params}: {params: {id: string}}): Promise<Response> {
  const session = await getIronSession<Session>(cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const db = await connect_drizzle();
  const histories = await db.select().from(history).where(eq(history.id, params.id));
  if (histories[0].owner !== session.uid) {
    return Response.json([], {status: 401});
  }

  return Response.json({...histories[0], updated_at: histories[0].created_at.toISOString()});
}

export async function DELETE(_: Request, {params}: {params: {id: string}}): Promise<Response> {
  const session = await getIronSession<Session>(cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json({}, {status: 401});
  }
  const db = await connect_drizzle();
  await db.delete(history).where(eq(history.id, params.id));
  return Response.json({});
}
