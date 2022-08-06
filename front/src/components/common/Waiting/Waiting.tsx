// TAGether - Share self-made exam for classmates
// Waiting.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './Waiting.module.scss';
import React from 'react';
import Modal from '@/common/Modal/Modal';

export default function useWaiting(): [() => React.ReactElement, () => void] {
  const [is_open, SetIsOpen] = React.useState(false);
  return [
    () => (
      <div onClick={e => e.preventDefault()}>
        <Modal isOpen={is_open} close={() => undefined}>
          <div className={css.modal}>
            <span>
              サーバーからの応答を待っています……
              <br />
              （動作しない場合は接続を確認するか、ページをリロードしてもう一度やり直してください）
            </span>
          </div>
        </Modal>
      </div>
    ),
    () => SetIsOpen(true),
  ];
}
