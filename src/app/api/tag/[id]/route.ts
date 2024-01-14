// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {tag} from 'src/db/schema';
import {connect_drizzle} from '../../../../db/drizzle';
import {eq} from 'drizzle-orm';
import {cookies} from 'next/headers';
import {getIronSession} from 'iron-session';
import {Session} from '@mytypes/Session';
import {env} from 'env';

export async function GET(_: Request, {params}: {params: {id: number}}): Promise<Response> {
  const session = await getIronSession<Session>(cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const {db, con} = await connect_drizzle();
  const tags = (await db.select().from(tag).where(eq(tag.id, params.id))).map(e => {
    return {...e, updated_at: e.updated_at.toISOString()};
  });
  con.end();
  return Response.json(tags);
}

export type PutTag = {
  name: string;
  description: string;
};
export async function PUT(req: Request, {params}: {params: {id: number}}): Promise<Response> {
  const session = await getIronSession<Session>(cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const data: PutTag = await req.json();
  const {db, con} = await connect_drizzle();
  await db.update(tag).set(data).where(eq(tag.id, params.id));
  con.end();
  return Response.json({message: ''});
}
