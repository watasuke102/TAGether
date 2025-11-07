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
import { User } from '@mytypes/User';
import { Session } from '@mytypes/Session';
import { cookies } from 'next/headers';
import { env } from 'env';

export async function GET(): Promise<Response> {
  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  if (session.is_logged_in !== true) {
    return Response.json({}, { status: 401 });
  }
  const { db, con } = connect_drizzle();
  const fetched_user = await db.select().from(users).where(eq(users.uid, session.uid));
  con.end();
  const user: User = {
    ...fetched_user[0],
    favorite_list: JSON.parse(fetched_user[0].favorite_list ?? '[]'),
  };
  return Response.json(user);
}
