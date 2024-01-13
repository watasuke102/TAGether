// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {int, mysqlTable, timestamp, text, boolean, varchar} from 'drizzle-orm/mysql-core';

export const exam = mysqlTable('exam', {
  id: int('id').notNull().primaryKey().autoincrement(),
  updated_at: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  version: int('version').notNull().default(2),
  title: text('title').notNull(),
  description: text('description').notNull(),
  tag: text('tag').notNull(),
  list: text('list').notNull(),
  deleted: boolean('deleted').notNull().default(false),
});

export const tag = mysqlTable('tag', {
  id: int('id').notNull().primaryKey().autoincrement(),
  updated_at: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  name: text('name').notNull(),
  description: text('description').notNull(),
});

export const request = mysqlTable('request', {
  id: int('id').notNull().primaryKey().autoincrement(),
  updated_at: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  body: text('body').notNull(),
  answer: text('answer'),
});

export const users = mysqlTable('users', {
  uid: varchar('uid', {length: 255}).notNull().primaryKey(),
  email: text('email').notNull(),
  is_admin: boolean('is_admin').notNull().default(false),
});
