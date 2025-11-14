// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './TagListEdit.module.scss';
import AddIcon from '@assets/add.svg';
import CloseIcon from '@assets/close.svg';
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

const PICKER_ID = 'tag_picker';

export default function TagListEdit(props: Props): React.ReactElement {
  const [is_picker_open, SetIsPickerOpen] = React.useState(false);
  const [is_modal_open, SetIsModalOpen] = React.useState(false);
  const [picker_pos, SetPickerPos] = React.useState({top: 0, left: 0});
  const [search_box, SetSearchBox] = React.useState('');

  React.useEffect(() => {
    const CloseOnClickOutside = (ev: MouseEvent) => {
      const picker = document.getElementById(PICKER_ID);
      if (!picker) return;

      // 選択したタグを削除するためのクリックでは閉じない
      if (ev.target instanceof Element) {
        // クリックした要素それ自体が選択済みタグ
        if (ev.target instanceof HTMLElement && ev.target.dataset.taglistSelectedItem === 'true') {
          return;
        }
        // 選択済みタグの子要素
        const closest = ev.target?.closest(`.${css.item}`);
        if (closest instanceof HTMLElement && closest.dataset.taglistSelectedItem === 'true') {
          return;
        }
      }

      if (!picker.contains(ev.target as Node)) {
        SetIsPickerOpen(false);
      }
    };

    document.addEventListener('click', CloseOnClickOutside);
    return () => document.removeEventListener('click', CloseOnClickOutside);
  }, [is_picker_open]);

  function UpdateTag(new_tags: TagData[]) {
    const tag_list = Array.from(new Map(new_tags.map(e => [e.id, e])).values());
    props.SetTag(tag_list);
  }

  function PickerOpen(e: React.MouseEvent) {
    if (is_picker_open) {
      return;
    }
    SetPickerPos({
      left: e.clientX,
      top: e.clientY + window.scrollY + 30, // ボタンと重ならないように
    });
    SetIsPickerOpen(true);
  }

  function TagList() {
    const elements = props.tags
      .filter(e => search_box === '' || e.name.includes(search_box))
      .map(e => (
        <div key={`taglist_${e.id}`} className={css.item} onClick={() => UpdateTag([...props.current_tag, e])}>
          <div className={css.item_icon}>
            <AddIcon />
          </div>
          <span>{e.name}</span>
        </div>
      ));
    // 新規作成欄
    elements.unshift(
      <div className={`${css.item} ${css.add_wrapper}`} onClick={() => SetIsModalOpen(true)}>
        <div className={css.item_icon}>
          <AddIcon />
        </div>
        <span>新規作成...</span>
      </div>,
    );
    return elements;
  }

  return (
    <>
      <div className={css.current_tag}>
        <div className={`${css.item} ${css.add_wrapper}`} onClick={e => PickerOpen(e)}>
          <div className={css.item_icon}>
            <AddIcon />
          </div>
          <span>追加</span>
        </div>
        {/* タグ一覧（クリックで削除） */}
        {props.current_tag.map((e, i) => (
          <div
            key={`current_tag_${i}`}
            className={css.item}
            data-taglist-selected-item
            onClick={() => UpdateTag(props.current_tag.filter((_, j) => j !== i))}
          >
            <div className={css.item_icon}>
              <CloseIcon />
            </div>
            <span>{e.name}</span>
          </div>
        ))}
      </div>

      {/* タグピッカー */}
      <AnimatePresence>
        {is_picker_open &&
          (props.current_tag.length >= 8 ? (
            // タグ
            <motion.div
              id={PICKER_ID}
              className={`${css.tag_picker} ${css.picker_error}`}
              style={picker_pos}
              {...fadeinout}
            >
              <span>
                タグの登録上限に達しました
                <br />
                8つ未満になるように削除してください
              </span>
              <div className={css.close} onClick={() => SetIsPickerOpen(false)}>
                <CloseIcon />
              </div>
            </motion.div>
          ) : (
            <motion.div
              id={PICKER_ID}
              className={`${css.tag_picker} ${css.picker_normal}`}
              style={picker_pos}
              {...fadeinout}
            >
              <form className={css.search}>
                <input placeholder='検索...' value={search_box} onChange={e => SetSearchBox(e.target.value)} />
              </form>

              <div className={css.close} onClick={() => SetIsPickerOpen(false)}>
                <CloseIcon />
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
      />
    </>
  );
}
