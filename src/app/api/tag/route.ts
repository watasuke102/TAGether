// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {tag} from 'src/db/schema';
import {connect_drizzle} from '../../../db/drizzle';

export async function GET(): Promise<Response> {
  const db = await connect_drizzle();
  const tags = await db.select().from(tag);
  return Response.json(tags);
}

export type PostTag = {
  name: string;
  description: string;
};
export async function POST(req: Request): Promise<Response> {
  const data: PostTag = await req.json();
  const db = await connect_drizzle();
  const result = await db.insert(tag).values(data);
  return Response.json({inserted_id: result[0].insertId});
}