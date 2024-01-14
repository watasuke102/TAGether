// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {User} from '@mytypes/User';
import {useApiData} from './common';

const user_key = '/api/user';

export const useUser = useApiData<User>(user_key);
