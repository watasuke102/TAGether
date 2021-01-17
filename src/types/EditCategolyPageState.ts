// TAGether - Share self-made exam for classmates
// EditCategolyPageState.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import Exam from './Exam';
import Categoly from './Categoly';

export default interface EditCategolyPageState{
  isModalOpen: boolean,
  res_result:  string,
  categoly: Categoly,
  exam: Exam[],
  showConfirmBeforeLeave: boolean
}
