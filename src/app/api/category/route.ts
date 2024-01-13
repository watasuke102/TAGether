// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {exam, tag} from 'src/db/schema';
import {connect_drizzle} from '../../../db/drizzle';
import {cookies} from 'next/headers';
import {getIronSession} from 'iron-session';
import {replace_tag_of_category} from '@utils/ReplaceTagOfCategory';
import {Session} from '@mytypes/Session';
import {env} from 'env';

export async function GET(): Promise<Response> {
  const session = await getIronSession<Session>(cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const db = await connect_drizzle();
  const tags = await db.select().from(tag);
  const categories = (
    await db
      .select({
        id: exam.id,
        updated_at: exam.updated_at,
        title: exam.title,
        description: exam.description,
        tag: exam.tag,
        deleted: exam.deleted,
      })
      .from(exam)
  ).map(e => {
    return {...e, updated_at: e.updated_at.toISOString()};
  });

  return Response.json(replace_tag_of_category(categories, tags));
}

export type NewCategory = {
  title: string;
  description: string;
  list: string;
};
export async function POST(req: Request): Promise<Response> {
  const session = await getIronSession<Session>(cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const data: NewCategory = await req.json();
  const db = await connect_drizzle();
  const result = await db.insert(exam).values({...data, version: 2, tag: ''});
  return Response.json({inserted_id: result[0].insertId});
}
