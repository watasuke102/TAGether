// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {cookies} from 'next/headers';
import {getIronSession} from 'iron-session';
import {exam, tag} from 'src/db/schema';
import {replace_tag_of_category} from '@utils/ReplaceTagOfCategory';
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
    e.updated_at.setHours(e.updated_at.getHours() + 9);
    return {
      ...e,
      updated_at: e.updated_at.toISOString(),
      tag: replace_tag_of_category(e.tag, tags),
    };
  });
  con.end();
  return Response.json(categories);
}

export type NewCategory = {
  title: string;
  description: string;
  list: string;
};
export async function POST(req: Request): Promise<Response> {
  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const data: NewCategory = await req.json();
  const {db, con} = connect_drizzle();
  const result = await db
    .insert(exam)
    .values({...data, version: 2, tag: ''})
    .returning({inserted_id: exam.id});
  con.end();
  webhook(env.WEBHOOK.CATEGORY_ADD, '新規カテゴリ追加', [
    {name: 'タイトル', value: data.title},
    {name: '説明', value: data.description},
  ]);
  return Response.json({inserted_id: result[0].inserted_id});
}
