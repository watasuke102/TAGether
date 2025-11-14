import {env} from 'env';
import {NextResponse} from 'next/server';
import {connect_drizzle} from 'src/db/drizzle';
import {email_login_tokens} from 'src/db/schema';
import isEmail from 'validator/es/lib/isEmail';
import bcrypt from 'bcrypt';
import {and, eq, gt} from 'drizzle-orm';
import {ensure_user_exist_and_new_session} from '../../new_session';

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
    await ensure_user_exist_and_new_session(data.email, db);
    return NextResponse.json({is_verification_success: true});
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {error_message: 'サーバーエラーが発生しました。\nしばらく待ってから再度お試しください。'},
      {status: 500},
    );
  }
}
