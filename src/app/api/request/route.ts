// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {request} from 'src/db/schema';
import {connect_drizzle} from '../../../db/drizzle';
import {cookies} from 'next/headers';
import {getIronSession} from 'iron-session';
import {Session} from '@mytypes/Session';
import {env} from 'env';

export async function GET(): Promise<Response> {
  const session = await getIronSession<Session>(cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const db = await connect_drizzle();
  const requests = await db.select().from(request);
  return Response.json(requests);
}

export async function POST(req: Request): Promise<Response> {
  const session = await getIronSession<Session>(cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const body: string = await req.text();
  const db = await connect_drizzle();
  const result = await db.insert(request).values({body});
  return Response.json({inserted_id: result[0].insertId});
}
