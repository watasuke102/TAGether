// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {eq} from 'drizzle-orm';
import {getIronSession} from 'iron-session';
import {cookies} from 'next/headers';
import {Session} from '@mytypes/Session';
import {DrizzleConnection} from 'src/db/drizzle';
import {logs, users} from 'src/db/schema';
import {env} from 'env';
import {webhook} from '../webhook';

export async function ensure_user_exist_and_new_session(
  user_email: string,
  db: DrizzleConnection['db'],
  route_for_log: string,
): Promise<Session> {
  let user = await db.select().from(users).where(eq(users.email, user_email));
  if (user.length === 0) {
    // ユーザー登録
    user = await db
      .insert(users)
      .values({
        email: user_email,
      })
      .returning();
      await db.insert(logs).values({
        severity: 'INFO',
        path: route_for_log,
        message: '新規ユーザー登録',
        cause_user: user[0].uid,
      });
    webhook(env.WEBHOOK.NEW_USER, '新規ユーザー', [{name: 'email', value: user_email}]);
  }

  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  session.is_logged_in = true;
  session.is_admin = user[0].is_admin;
  session.uid = user[0].uid;
  await session.save();

  return session;
}
