// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {NextResponse} from 'next/server';
import isEmail from 'validator/es/lib/isEmail';
import bcrypt from 'bcrypt';
import {and, eq, gt} from 'drizzle-orm';
import {email_login_tokens, logs} from 'src/db/schema';
import {env} from 'env';
import {connect_drizzle} from 'src/db/drizzle';
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
  const {db, con} = await connect_drizzle();
  if (typeof data.id !== 'string' || (typeof data.token !== 'string' && typeof data.email !== 'string')) {
    await db.insert(logs).values({
      severity: 'WARN',
      path: '/api/auth/otp/verify',
      message: `無効なPOSTデータ: ${JSON.stringify(data)}`,
    });
    con.end();
    return NextResponse.json({error_message: '無効なリクエストが送信されました'}, {status: 400});
  }
  if (!isEmail(data.email) || env.EMAIL_WHITE_LIST.every(e => !e.test(data.email))) {
    await db.insert(logs).values({
      severity: 'WARN',
      path: '/api/auth/otp/verify',
      message: `許可されていないメールアドレス形式: ${data.email}`,
    });
    con.end();
    return NextResponse.json({error_message: '許可されていないメールアドレス形式です'}, {status: 400});
  }

  try {
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
      await db.insert(logs).values({
        severity: 'WARN',
        path: '/api/auth/otp/verify',
        message:
          record.length === 0 ? `存在しないか期限切れのトークンID: ${data.id}` : `既に使用されたトークンID: ${data.id}`,
      });
      con.end();
      return NextResponse.json({error_message: 'トークンが無効です'}, {status: 400});
    }

    if (!(await bcrypt.compare(data.token, record[0].token))) {
      con.end();
      return NextResponse.json({is_verification_success: false});
    }

    await db.update(email_login_tokens).set({is_used: true}).where(eq(email_login_tokens.id, data.id));
    await ensure_user_exist_and_new_session(data.email, db, '/api/auth/otp/verify');
    return NextResponse.json({is_verification_success: true});
  } catch (e) {
    await db.insert(logs).values({
      severity: 'ERROR',
      path: '/api/auth/otp/verify',
      message: `exception: ${e}`,
    });
    con.end();
    console.error(e);
    return NextResponse.json(
      {error_message: 'サーバーエラーが発生しました。\nしばらく待ってから再度お試しください。'},
      {status: 500},
    );
  }
}
