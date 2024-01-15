// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {connect_drizzle} from '../../../../db/drizzle';
import {eq} from 'drizzle-orm';
import {cookies} from 'next/headers';
import {getIronSession} from 'iron-session';
import {Session} from '@mytypes/Session';
import {env} from 'env';
import {webhook} from '../../webhook';
import {request} from 'src/db/schema';

export async function PUT(req: Request, {params}: {params: {id: number}}): Promise<Response> {
  const session = await getIronSession<Session>(cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in || !session.is_admin) {
    return Response.json([], {status: 401});
  }
  const answer: string = await req.text();
  const {db, con} = await connect_drizzle();
  const result = await db.update(request).set({answer}).where(eq(request.id, params.id));
  const updated_req = await db.select().from(request).where(eq(request.id, params.id));
  con.end();
  webhook(env.WEBHOOK.UPDATE, '要望に対する回答追加', [
    {name: '要望内容', value: updated_req[0].body},
    {name: '回答', value: answer},
  ]);
  return Response.json({inserted_id: result[0].insertId});
}
