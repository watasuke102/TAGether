// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import { users } from 'src/db/schema';
import { connect_drizzle } from 'src/db/drizzle';
import { eq } from 'drizzle-orm';
import { getIronSession } from 'iron-session';
import { Session } from '@mytypes/Session';
import { cookies } from 'next/headers';
import { env } from 'env';

export async function PUT(req: Request): Promise<Response> {
  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  if (session.is_logged_in !== true) {
    return Response.json({}, { status: 401 });
  }
  const favorite_list: string = await req.text();
  const { db, con } = await connect_drizzle();
  await db.update(users).set({ favorite_list }).where(eq(users.uid, session.uid));
  con.end();
  return Response.json({});
}
