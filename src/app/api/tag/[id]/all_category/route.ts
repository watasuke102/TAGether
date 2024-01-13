// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {exam, tag} from 'src/db/schema';
import {connect_drizzle} from '../../../../../db/drizzle';
import {eq, sql} from 'drizzle-orm';
import {CategoryDataType} from '@mytypes/Categoly';
import {cookies} from 'next/headers';
import {getIronSession} from 'iron-session';
import {Session} from '@mytypes/Session';
import {env} from 'env';

// 特定のタグが付いたカテゴリをすべて取得する
export async function GET(_: Request, {params}: {params: {id: number}}): Promise<Response> {
  const session = await getIronSession<Session>(cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const db = await connect_drizzle();
  const fetched_categories = (
    await db
      .select()
      .from(exam)
      .where(sql`INSTR(exam.tag, ${params.id})`)
  ).map(e => {
    return {...e, updated_at: e.updated_at.toISOString()};
  });
  const categories_exam: CategoryDataType[] = fetched_categories.reduce(
    (acc, cur) => acc.concat(JSON.parse(cur.list)),
    [],
  );

  const specified_tag = await db.select({name: tag.name}).from(tag).where(eq(tag.id, params.id));
  return Response.json({
    id: -1,
    title: `タグ (${specified_tag[0].name})`,
    description: '',
    updated_at: new Date().toISOString(),
    tag: [],
    deleted: false,
    version: 2,
    list: JSON.stringify(categories_exam),
  });
}
