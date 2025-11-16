// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {eq} from 'drizzle-orm';
import {cookies} from 'next/headers';
import {getIronSession} from 'iron-session';
import {logs, tag} from 'src/db/schema';
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
  const tags = (
    await db
      .select()
      .from(tag)
      .where(eq(tag.id, Number((await params).id)))
  ).map(e => {
    e.updated_at.setHours(e.updated_at.getHours() + 9);
    return {...e, updated_at: e.updated_at.toISOString()};
  });
  con.end();
  return Response.json(tags);
}

export type PutTag = {
  name: string;
  description: string;
};
export async function PUT(req: Request, {params}: {params: Promise<{id: string}>}): Promise<Response> {
  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const data: PutTag = await req.json();
  const {db, con} = connect_drizzle();
  const old_tag = await db
    .select()
    .from(tag)
    .where(eq(tag.id, Number((await params).id)));
  await db
    .update(tag)
    .set(data)
    .where(eq(tag.id, Number((await params).id)));
  webhook(env.WEBHOOK.TAG_REQUEST_ADD, 'タグ更新', [
    {name: 'diff (name)', value: `\`\`\`diff\n- ${old_tag[0].name}\n+ ${data.name}\n\`\`\``},
    {name: 'diff (description)', value: `\`\`\`diff\n- ${old_tag[0].description}\n+ ${data.description}\n\`\`\``},
  ]);
  await db.insert(logs).values({
    severity: 'DEBUG',
    path: '/api/tag/[id]',
    message: `タグ更新 (id: ${old_tag[0].id})\n\nold:\nname: ${old_tag[0].name}\ndescription: ${old_tag[0].description}\n\nnew:\nname: ${data.name}\ndescription: ${data.description}\n`,
    cause_user: session.uid,
  });
  con.end();
  return Response.json({message: ''});
}
