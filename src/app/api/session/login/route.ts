// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {cookies} from 'next/headers';
import {users} from 'src/db/schema';
import {connect_drizzle} from '../../../../db/drizzle';
import {eq} from 'drizzle-orm';
import {getIronSession} from 'iron-session';
import {Session} from '@mytypes/Session';
import {env} from 'env';
import {webhook} from '../../webhook';

export type LoginData = {
  uid: string;
  email: string;
};
export async function POST(req: Request): Promise<Response> {
  const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
  const data: LoginData = await req.json();
  const {db, con} = connect_drizzle();
  const registered_user = await db.select().from(users).where(eq(users.uid, data.uid));

  let user: Omit<Session, 'is_logged_in'> | undefined = registered_user?.at(0);
  if (!user) {
    // registration
    if (
      !env.EMAIL_WHITE_LIST.map(e => e.test(data.email)).includes(true) &&
      !(process.env.NODE_ENV === 'development' && env.DISABLE_LOGIN_FEATURE_ON_DEVELOPING)
    ) {
      return Response.json({message: '許可されていないメールアドレス形式です'});
    }
    await db.insert(users).values({...data});
    webhook(env.WEBHOOK.NEW_USER, '新規ユーザー', [
      {name: 'email', value: data.email},
      {name: 'uid', value: data.uid},
    ]);
    user = {
      ...data,
      is_admin: false,
    };
  }
  con.end();

  session.is_logged_in = true;
  session.uid = user.uid;
  session.is_admin = user.is_admin;
  await session.save();
  return Response.json({});
}
