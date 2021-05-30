// TAGether - Share self-made exam for classmates
// ModalData.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.

import React from 'react';

interface ModalData {
  body:   React.ReactElement
  isOpen: boolean
  close:  Function
}

export default ModalData;
