// TAGether - Share self-made exam for classmates
// categoly.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import Categoly from './Categoly';

export default interface ModalData {
  data:   Categoly,
  isOpen: boolean,
  close:  Function
}
