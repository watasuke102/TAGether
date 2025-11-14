// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {getIronSession} from 'iron-session';
import {cookies} from 'next/headers';
import {eq} from 'drizzle-orm';
import {history} from 'src/db/schema';
import {connect_drizzle} from 'src/db/drizzle';
import {Session} from '@mytypes/Session';
import {env} from 'env';

export async function GET(_: Request, {params}: {params: Promise<{id: string}>}): Promise<Response> {
  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const {db, con} = connect_drizzle();
  const histories = await db
    .select()
    .from(history)
    .where(eq(history.id, (await params).id));
  if (histories[0].owner !== session.uid) {
    return Response.json([], {status: 401});
  }
  con.end();
  histories[0].created_at.setHours(histories[0].created_at.getHours() + 9);
  return Response.json({
    ...histories[0],
    updated_at: histories[0].created_at.toISOString(),
  });
}

export async function DELETE(_: Request, {params}: {params: Promise<{id: string}>}): Promise<Response> {
  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json({}, {status: 401});
  }
  const {db, con} = connect_drizzle();
  await db.delete(history).where(eq(history.id, (await params).id));
  con.end();
  return Response.json({});
}
