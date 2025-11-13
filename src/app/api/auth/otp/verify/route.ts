import {randomInt} from 'node:crypto';
import {env} from 'env';
import {NextResponse} from 'next/server';
import {connect_drizzle} from 'src/db/drizzle';
import {email_login_tokens, users} from 'src/db/schema';
import isEmail from 'validator/es/lib/isEmail';
import bcrypt from 'bcrypt';
import {and, eq, gt} from 'drizzle-orm';
import {getIronSession} from 'iron-session';
import {Session} from '@mytypes/Session';
import {cookies} from 'next/headers';
import {webhook} from 'src/app/api/webhook';

export type OtpVerifyRequest = {
  id: string;
  token: string;
  email: string;
};
export type OtpVerifyResponse =
  | {
      // 存在して、かつ期限内であるtokenが存在している
      // tokenが正しかったかどうかをbooleanで返却
      is_verification_success: boolean;
    }
  | {error_message: string};

export async function POST(res: Request): Promise<NextResponse<OtpVerifyResponse>> {
  const data = await res.json();
  if (typeof data.id !== 'string' || (typeof data.token !== 'string' && typeof data.email !== 'string')) {
    return NextResponse.json({error_message: '無効なリクエストが送信されました'}, {status: 400});
  }
  if (!isEmail(data.email) || env.EMAIL_WHITE_LIST.every(e => !e.test(data.email))) {
    return NextResponse.json({error_message: '許可されていないメールアドレス形式です'}, {status: 400});
  }

  try {
    const {db, con} = await connect_drizzle();
    // prettier-ignore
    const record = await db
      .select()
      .from(email_login_tokens)
      .where(and(
        eq(email_login_tokens.id, data.id),
        gt(email_login_tokens.expire_at, new Date())
      ))
      .limit(1);
    if (record.length === 0 || record[0].is_used) {
      con.end();
      return NextResponse.json({error_message: 'トークンが無効です'}, {status: 400});
    }

    if (!(await bcrypt.compare(data.token, record[0].token))) {
      con.end();
      return NextResponse.json({is_verification_success: false});
    }

    await db.update(email_login_tokens).set({is_used: true}).where(eq(email_login_tokens.id, data.id));

    let user = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (user.length === 0) {
      // ユーザー登録
      user = await db
        .insert(users)
        .values({
          email: data.email,
        })
        .returning();
      webhook(env.WEBHOOK.NEW_USER, '新規ユーザー', [{name: 'email', value: data.email}]);
    }
    con.end();

    const session = await getIronSession<Session>(await cookies(), env.SESSION_OPTION);
    session.is_logged_in = true;
    session.is_admin = user[0].is_admin;
    session.uid = user[0].uid;
    await session.save();

    return NextResponse.json({is_verification_success: true});
  } catch (e) {
    console.error(e);
    return NextResponse.json({error_message: 'サーバーエラーが発生しました'}, {status: 500});
  }
}
