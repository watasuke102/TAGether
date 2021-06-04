// TAGether - Share self-made exam for classmates
// TagContainer.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/TagContainer.module.scss';
import React from 'react';
import Modal from './Modal';
import Router from 'next/router';
import Button from './Button';

interface TagData { tag: string }

export default function Tag(props: TagData): React.ReactElement {
  const [is_modal_open, SetIsModalOpen] = React.useState(false);
  return (
    <div className={css.tag_container}>
      {
        props.tag.split(',').map((e, i) => {
          return (<>
            <div key={`tagitem_${i}`} className={css.tag}
              onClick={e => { e.stopPropagation(); SetIsModalOpen(true); }}>
              <span>{e}</span>
            </div>
            <Modal isOpen={is_modal_open} close={() => SetIsModalOpen(false)}>
              <div className={css.window}>
                <p>解答履歴をすべて削除しますか？</p>
                <div className={css.window_buttons}>
                  <Button {...{
                    type: 'material', icon: 'fas fa-times', text: '閉じる',
                    onClick: () => SetIsModalOpen(false)
                  }} />
                </div>
              </div>
            </Modal>
          </>);
        })}
    </div>
  );
}
