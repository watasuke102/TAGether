// TAGether - Share self-made exam for classmates
// EditCategolyPageState.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import CategolyManager from '../components/CategolyManager';

export default interface EditCategolyPageState{
  res_result:  string,
  isModalOpen: boolean,
  categolyManager: CategolyManager,
  showConfirmBeforeLeave: boolean
}
