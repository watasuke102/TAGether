// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {mutate} from 'swr';
import {User} from '@mytypes/User';
import {useApiData} from './common';
import axios from 'axios';
import {ToggleElement} from '@utils/ArrayUtil';

const user_key = '/api/user';

export const mutate_user = (): Promise<void> => mutate(user_key);
export const useUser = useApiData<User>(user_key);

export async function toggle_favorite(current: User, category_id: number): Promise<void> {
  const new_favorite_list = ToggleElement(current.favorite_list, category_id);
  await axios.put(`${user_key}/favorite`, JSON.stringify(new_favorite_list));
  mutate_user();
}
