// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {cookies} from 'next/headers';
import {getIronSession} from 'iron-session';
import {request} from 'src/db/schema';
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
  const requests = await db.select().from(request);
  con.end();
  return Response.json(requests);
}

export async function POST(req: Request): Promise<Response> {
  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const body: string = await req.text();
  const {db, con} = connect_drizzle();
  const result = await db.insert(request).values({body}).returning({inserted_id: request.id});
  con.end();
  webhook(env.WEBHOOK.TAG_REQUEST_ADD, '新規要望追加', [{name: '内容', value: body}]);
  return Response.json({inserted_id: result[0].inserted_id});
}
