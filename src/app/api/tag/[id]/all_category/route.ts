// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {eq, sql} from 'drizzle-orm';
import {cookies} from 'next/headers';
import {getIronSession} from 'iron-session';
import {CategoryDataType} from '@mytypes/Category';
import {exam, tag} from 'src/db/schema';
import {Session} from '@mytypes/Session';
import {env} from 'env';
import {connect_drizzle} from '../../../../../db/drizzle';

// 特定のタグが付いたカテゴリをすべて取得する
export async function GET(_: Request, {params}: {params: Promise<{id: string}>}): Promise<Response> {
  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const {db, con} = connect_drizzle();
  const fetched_categories = (
    await db
      .select()
      .from(exam)
      .where(sql`STRPOS(exam.tag, ${Number((await params).id)}) > 0`)
  ).map(e => {
    e.updated_at.setHours(e.updated_at.getHours() + 9);
    return {...e, updated_at: e.updated_at.toISOString()};
  });
  const categories_exam: CategoryDataType[] = fetched_categories.reduce(
    (acc, cur) => acc.concat(JSON.parse(cur.list)),
    [],
  );

  const specified_tag = await db
    .select({name: tag.name})
    .from(tag)
    .where(eq(tag.id, Number((await params).id)));
  con.end();
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
