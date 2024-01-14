// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {MySql2Database, drizzle} from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

export async function connect_drizzle(): Promise<{db: MySql2Database; con: mysql.Connection}> {
  const con = await mysql.createConnection({
    host: 'mysql',
    user: 'root',
    password: 'root',
    database: 'tagether',
  });
  const db = drizzle(con);
  return {db, con};
}
