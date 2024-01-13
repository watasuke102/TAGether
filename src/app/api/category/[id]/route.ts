// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {exam, tag} from 'src/db/schema';
import {connect_drizzle} from '../../../../db/drizzle';
import {replace_tag_of_category} from '@utils/ReplaceTagOfCategory';
import {eq, sql} from 'drizzle-orm';
import {cookies} from 'next/headers';
import {getIronSession} from 'iron-session';
import {Session} from '@mytypes/Session';
import {env} from 'env';

export async function GET(_: Request, {params}: {params: {id: number}}): Promise<Response> {
  const session = await getIronSession<Session>(cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const db = await connect_drizzle();
  const tags = await db.select().from(tag);
  const categories = (await db.select().from(exam).where(eq(exam.id, params.id))).map(e => {
    return {...e, updated_at: e.updated_at.toISOString()};
  });

  return Response.json(replace_tag_of_category(categories, tags));
}

export type PutCategory = {
  title: string;
  description: string;
  tag: string;
  list: string;
};
export async function PUT(req: Request, {params}: {params: {id: number}}): Promise<Response> {
  const session = await getIronSession<Session>(cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const data: PutCategory = await req.json();
  const db = await connect_drizzle();
  const result = await db
    .update(exam)
    .set({...data})
    .where(eq(exam.id, params.id));
  return Response.json({inserted_id: result[0].insertId});
}

export async function DELETE(_: Request, {params}: {params: {id: number}}): Promise<Response> {
  const session = await getIronSession<Session>(cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const db = await connect_drizzle();
  const result = await db
    .update(exam)
    .set({deleted: sql`if (deleted = 0, 1, 0)`})
    .where(eq(exam.id, params.id));
  return Response.json({inserted_id: result[0].insertId});
}
