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
import TagData from '../types/TagData';

interface Props { tag: TagData[] }

export default function Tag(props: Props): React.ReactElement {
  const [is_modal_open, SetIsModalOpen] = React.useState(false);
  return (
    <div className={css.tag_container}>
      {
        props.tag.map((e, i) => {
          return (<>
            <div key={`tagitem_${i}`} className={css.tag}
              onClick={ev => { ev.stopPropagation(); Router.push(`?tag=${e.id ?? `-1&name=${e.name}`}`); }}>
              <span>{e.name}</span>
            </div>
            <Modal isOpen={is_modal_open} close={() => SetIsModalOpen(false)}>
              <div className={css.window}>
                <p>タグ詳細</p>
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
