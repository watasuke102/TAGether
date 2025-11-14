// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {eq, sql} from 'drizzle-orm';
import {cookies} from 'next/headers';
import {getIronSession} from 'iron-session';
import {replace_tag_of_category} from '@utils/ReplaceTagOfCategory';
import {exam, tag} from 'src/db/schema';
import {Session} from '@mytypes/Session';
import {env} from 'env';
import {connect_drizzle} from '../../../../db/drizzle';
import {webhook} from '../../webhook';

export async function GET(_: Request, {params}: {params: Promise<{id: string}>}): Promise<Response> {
  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const {db, con} = connect_drizzle();
  const tags = await db.select().from(tag);
  const categories = await db
    .select()
    .from(exam)
    .where(eq(exam.id, Number((await params).id)));
  con.end();
  categories[0].updated_at.setHours(categories[0].updated_at.getHours() + 9);
  return Response.json({
    ...categories[0],
    updated_at: categories[0].updated_at.toISOString(),
    tag: replace_tag_of_category(categories[0].tag, tags),
  });
}

export type PutCategory = {
  title: string;
  description: string;
  tag: string;
  list: string;
};
export async function PUT(req: Request, {params}: {params: Promise<{id: string}>}): Promise<Response> {
  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const data: PutCategory = await req.json();
  const {db, con} = connect_drizzle();
  const result = await db
    .update(exam)
    .set({...data})
    .where(eq(exam.id, Number((await params).id)))
    .returning({inserted_id: exam.id});
  con.end();
  webhook(env.WEBHOOK.UPDATE, 'カテゴリ更新', [{name: 'タイトル', value: data.title}]);
  return Response.json({inserted_id: result[0].inserted_id});
}

export async function DELETE(_: Request, {params}: {params: Promise<{id: string}>}): Promise<Response> {
  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const {db, con} = connect_drizzle();
  const result = await db
    .update(exam)
    .set({deleted: sql`if (deleted = 0, 1, 0)`})
    .where(eq(exam.id, Number((await params).id)))
    .returning({inserted_id: exam.id});
  con.end();
  return Response.json({inserted_id: result[0].inserted_id});
}
