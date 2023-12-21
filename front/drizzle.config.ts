// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import type {Config} from 'drizzle-kit';

const config: Config = {
  schema: './src/db/schema.ts',
  out: './src/drizzle',
};
export default config;
