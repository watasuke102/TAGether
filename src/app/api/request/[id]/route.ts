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

export async function PUT(req: Request, {params}: {params: Promise<{id: string}>}): Promise<Response> {
  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in || !session.is_admin) {
    return Response.json([], {status: 401});
  }
  const answer: string = await req.text();
  const {db, con} = connect_drizzle();
  const result = await db
    .update(request)
    .set({answer})
    .where(eq(request.id, Number((await params).id)))
    .returning();
  con.end();
  webhook(env.WEBHOOK.UPDATE, '要望に対する回答更新', [
    {name: '要望内容', value: result[0].body},
    {name: '回答', value: answer},
  ]);
  return Response.json({inserted_id: result[0].id});
}
