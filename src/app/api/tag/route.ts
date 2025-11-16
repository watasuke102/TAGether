// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {cookies} from 'next/headers';
import {getIronSession} from 'iron-session';
import {logs, tag} from 'src/db/schema';
import {Session} from '@mytypes/Session';
import {env} from 'env';
import {connect_drizzle} from '../../../db/drizzle';
import {webhook} from '../webhook';

export async function GET(): Promise<Response> {
  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const {db, con} = connect_drizzle();
  const tags = (await db.select().from(tag)).map(e => {
    e.updated_at.setHours(e.updated_at.getHours() + 9);
    return {...e, updated_at: e.updated_at.toISOString()};
  });
  con.end();
  return Response.json(tags);
}

export type PostTag = {
  name: string;
  description: string;
};
export async function POST(req: Request): Promise<Response> {
  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const data: PostTag = await req.json();
  const {db, con} = connect_drizzle();
  const result = await db.insert(tag).values(data).returning({inserted_id: tag.id});
  webhook(env.WEBHOOK.TAG_REQUEST_ADD, '新規タグ追加', [
    {name: 'タグ名', value: data.name},
    {name: '説明', value: data.description},
  ]);
  await db.insert(logs).values({
    severity: 'INFO',
    path: '/api/tag',
    message: `新規タグ追加 (id: ${result[0].inserted_id} name: ${data.name}\ndescription: ${data.description})`,
    cause_user: session.uid,
  });
  con.end();
  return Response.json({inserted_id: result[0].inserted_id});
}
