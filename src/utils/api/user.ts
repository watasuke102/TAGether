// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import {mutate} from 'swr';
import {User} from '@mytypes/User';
import {ToggleElement} from '@utils/ArrayUtil';
import {useApiData} from './common';

const user_key = '/api/user';

export const mutate_user = (): Promise<void> => mutate(user_key);
export function useUser() {
  return useApiData<User>(user_key);
}

export async function toggle_favorite(current: User, category_id: number): Promise<void> {
  const new_favorite_list = ToggleElement(current.favorite_list, category_id);
  await fetch(`${user_key}/favorite`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(new_favorite_list),
  });
  mutate_user();
}
