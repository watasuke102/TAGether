// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import type {NextApiRequest, NextApiResponse} from 'next';
import {exam} from 'src/db/schema';
import {connect_drizzle} from '../../db/drizzle';

export default async function handle(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const db = await connect_drizzle();
  const query = await db
    .select({
      id: exam.id,
      updated_at: exam.updated_at,
      title: exam.title,
      description: exam.description,
      tag: exam.tag,
    })
    .from(exam);
  res.status(200).json(query);
}
