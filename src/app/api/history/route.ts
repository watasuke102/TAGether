// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {history} from 'src/db/schema';
import {connect_drizzle} from 'src/db/drizzle';
import {eq} from 'drizzle-orm';
import {getIronSession} from 'iron-session';
import {Session} from '@mytypes/Session';
import {cookies} from 'next/headers';
import {env} from 'env';
import {AllHistory} from '@mytypes/ExamHistory';
import Exam from '@mytypes/Exam';
import ExamState from '@mytypes/ExamState';

export async function GET(): Promise<Response> {
  const session = await getIronSession<Session>(cookies(), env.SESSION_OPTION);
  if (session.is_logged_in !== true) {
    return Response.json({}, {status: 401});
  }
  const {db, con} = await connect_drizzle();
  const histories: AllHistory[] = (
    await db
      .select({
        id: history.id,
        created_at: history.created_at,
        redo_times: history.redo_times,
        title: history.title,
        exam_state: history.exam_state,
      })
      .from(history)
      .where(eq(history.owner, session.uid))
  ).map(e => {
    return {
      ...e,
      created_at: e.created_at.toISOString(),
    };
  });
  con.end();
  return Response.json(histories);
}

export type NewHistory = {
  title: string;
  redo_times: number;
  exam_state: ExamState[];
  exam: Exam[];
};
export async function POST(req: Request): Promise<Response> {
  const session = await getIronSession<Session>(cookies(), env.SESSION_OPTION);
  if (!session.is_logged_in) {
    return Response.json([], {status: 401});
  }
  const data: NewHistory = await req.json();
  const {db, con} = await connect_drizzle();
  const result = await db.insert(history).values({...data, owner: session.uid});
  con.end();
  return Response.json({inserted_id: result[0].insertId});
}
