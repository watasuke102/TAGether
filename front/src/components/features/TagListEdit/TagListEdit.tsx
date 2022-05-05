// TAGether - Share self-made exam for classmates
// TagListEdit.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './TagListEdit.module.scss';
import {AnimatePresence, motion} from 'framer-motion';
import React from 'react';
import TagData from '@mytypes/TagData';
import TagDetail from '../TagDetail/TagDetail';

interface Props {
  tags: TagData[];
  current_tag: TagData[];
  SetTag: (e: TagData[]) => void;
}

const fadeinout = {
  variants: {
    init: {opacity: 0},
    main: {opacity: 1},
  },
  transition: {duration: 0.2},
  initial: 'init',
  animate: 'main',
  exit: 'init',
};

export default function TagListEdit(props: Props): React.ReactElement {
  const [is_picker_open, SetIsPickerOpen] = React.useState(false);
  const [is_modal_open, SetIsModalOpen] = React.useState(false);
  const [picker_pos, SetPickerPos] = React.useState({top: 0, left: 0});
  const [search_box, SetSearchBox] = React.useState('');
  const [current_tag, SetCurrentTag] = React.useState(props.current_tag);
  const [tag_list, SetTagList] = React.useState(props.tags);

  function UpdateTag(e: TagData[]) {
    SetCurrentTag(e);
    props.SetTag(e);
  }

  function PickerOpen(e: React.MouseEvent) {
    SetPickerPos({
      left: e.clientX,
      top: e.clientY + window.scrollY + 30, // ボタンと重ならないように
    });
    SetIsPickerOpen(true);
  }

  function TagList() {
    let list: TagData[];
    if (search_box !== '') {
      list = tag_list.filter(e => e.name.includes(search_box));
    } else {
      list = tag_list;
    }
    const elements = list.map(e => (
      <div key={`taglist_${e.id}`} className={css.item} onClick={() => UpdateTag([...current_tag, e])}>
        <div className='fas fa-plus' />
        <span>{e.name}</span>
      </div>
    ));
    // 新規作成欄
    elements.unshift(
      <div className={css.item} onClick={() => SetIsModalOpen(true)}>
        <div className='fas fa-plus' />
        <span>新規作成...</span>
      </div>,
    );
    return elements;
  }

  return (
    <>
      <div className={css.current_tag}>
        <div className={css.item} onClick={e => PickerOpen(e)}>
          <div className='fas fa-plus' />
          <span>追加</span>
        </div>
        {/* タグ一覧（クリックで削除） */}
        {current_tag.map((e, i) => (
          <div
            key={`current_tag_${i}`}
            className={css.item}
            onClick={() => UpdateTag(current_tag.filter((_, j) => j !== i))}
          >
            <div className='fas fa-times' />
            <span>{e.name}</span>
          </div>
        ))}
      </div>

      {/* タグピッカー */}
      <AnimatePresence>
        {is_picker_open &&
          (current_tag.length >= 8 ? (
            // タグ
            <motion.div className={`${css.tag_picker} ${css.picker_error}`} style={picker_pos} {...fadeinout}>
              <span>
                タグの登録上限に達しました
                <br />
                8つ未満になるように削除してください
              </span>
              <div className={css.close} onClick={() => SetIsPickerOpen(false)}>
                <span className='fas fa-times' />
              </div>
            </motion.div>
          ) : (
            <motion.div className={`${css.tag_picker} ${css.picker_normal}`} style={picker_pos} {...fadeinout}>
              <form className={css.search}>
                <input placeholder='検索...' value={search_box} onChange={e => SetSearchBox(e.target.value)} />
              </form>

              <div className={css.close} onClick={() => SetIsPickerOpen(false)}>
                <span className='fas fa-times' />
              </div>

              <div className={css.list}>
                <div className={css.inner}>
                  {/* タグ一覧（クリックで追加） */}
                  {TagList()}
                </div>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>

      <TagDetail
        createMode
        isOpen={is_modal_open}
        tag={{name: '', description: '', updated_at: ''}}
        close={() => SetIsModalOpen(false)}
        onComplete={(e: TagData) => {
          SetTagList([...tag_list, e]);
          SetIsModalOpen(false);
        }}
      />
    </>
  );
}
