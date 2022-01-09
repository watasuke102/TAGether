// TAGether - Share self-made exam for classmates
// EditCategolyPageState.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import Categoly from './Categoly';
import Exam from './Exam';

interface EditCategolyPageState {
  jsonEdit: boolean;
  isToastOpen: boolean;
  isModalOpen: boolean;
  is_using_old_form: boolean;
  // 成功した場合は''となる
  regist_error: string;
  categoly: Categoly;
  exam: Exam[];
  showConfirmBeforeLeave: boolean;
}

export default EditCategolyPageState;
