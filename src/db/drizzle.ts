// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {drizzle} from 'drizzle-orm/node-postgres';
import {Pool} from 'pg';

export type DrizzleConnection = {db: ReturnType<typeof drizzle>; con: Pool};

export function connect_drizzle(): DrizzleConnection {
  const con = new Pool({
    connectionString: 'postgresql://tagether:root@postgres:5432/tagether?sslmode=disable',
  });
  const db = drizzle(con);
  return {db, con};
}
