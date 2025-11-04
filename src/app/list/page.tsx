// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './list.module.scss';
import React from 'react';
import Button from '@/common/Button/Button';
import { useRouter } from 'next/navigation';
import { IndexedContainer } from '@/common/IndexedContainer';
import Loading from '@/common/Loading/Loading';
import Modal from '@/common/Modal/Modal';
import { SelectButton, SingleSelectBox } from '@/common/SelectBox';
import Form from '@/common/TextForm/Form';
import { useWaiting } from '@/common/Waiting';
import CategoryCard from '@/features/CategoryCard/CategoryCard';
import { useAllCategoryData, new_category } from '@utils/api/category';
import { AllCategoryDataType } from '@mytypes/Category';
import { useToastOperator } from '@/common/Toast/Toast';
import AddIcon from '@assets/add.svg';
import CloseIcon from '@assets/close.svg';
import CheckIcon from '@assets/check.svg';
import SortIcon from '@assets/sort.svg';

export default function list(): React.ReactElement {
  const router = useRouter();
  const Toast = useToastOperator();

  const [show_only_trash, SetShowOnlyTrash] = React.useState(false);
  const [search_str, SetSearchStr] = React.useState('');
  const [radio_state, SetRadioState] = React.useState('タイトル');
  const [newer_first, SetNewerFirst] = React.useState(true);
  const [list, isLoading] = useAllCategoryData();

  const [is_modal_open, SetIsModalOpen] = React.useState(false);
  const [category_name, SetCategoryName] = React.useState('');
  const [category_desc, SetCategoryDesc] = React.useState('');

  const [Waiting, StartWaiting] = useWaiting();

  function CardList(): React.ReactElement[] {
    const card_new_category = (
      <div key={'newcategory'} className={css.card} onClick={() => SetIsModalOpen(true)}>
        <div className={css.create_icon}>
          <AddIcon />
        </div>
        <p id={css.create_new}>新規作成</p>
      </div>
    );

    if (!list || list.length === 0) {
      return [card_new_category];
    }

    const cards: React.ReactElement[] = [];
    let searchResult: AllCategoryDataType[] = [];

    // 検索欄になにか記入されていたら、検索
    if (search_str !== '') {
      list.forEach(e => {
        let text: string = '';
        switch (radio_state) {
          case 'タイトル':
            text = e.title;
            break;
          case '説明':
            text = e.description;
            break;
          case 'ID':
            if (e.id?.toString() !== undefined) text = e.id.toString();
            break;
          case 'タグ':
            e.tag.forEach(a => (text += `${a.name},`));
            text = text.slice(0, -1);
            break;
        }
        // 検索欄に入力された文字と一致したら検索結果に追加
        if (text.indexOf(search_str) !== -1) searchResult.push(e);
      });
    } else {
      searchResult = list;
    }
    const category_list = searchResult.filter(e => e.deleted === show_only_trash);
    // 検索結果からカードを生成
    if (category_list.length === 0) {
      cards.push(
        <p key={'result_404'} className={css.notfound}>
          見つかりませんでした
        </p>,
      );
    } else {
      category_list.forEach(element => {
        cards.push(
          <div className={css.card_wrapper} key={`wrapper_${element.id}`}>
            <CategoryCard {...element} />
          </div>,
        );
      });
    }
    if (newer_first) {
      cards.reverse();
    }

    // カテゴリ作成ページへ飛ぶカードを追加
    cards.unshift(card_new_category);

    return cards;
  }

  return (
    <>
      <h1>カテゴリ一覧</h1>
      <div className={css.form}>
        <SelectButton
          type='check'
          desc='ゴミ箱内のカテゴリのみ表示'
          status={show_only_trash}
          onChange={SetShowOnlyTrash}
        />
        {/* 検索欄 */}
        <Form
          {...{
            label: '検索',
            value: search_str,
            rows: 1,
            OnChange: ev => SetSearchStr(ev.target.value),
          }}
        />
        <Button
          {...{
            text: '入力のクリア',
            icon: <CloseIcon />,
            OnClick: () => SetSearchStr(''),
            type: 'filled',
          }}
        />
        {/* 何を検索するか選択 */}
        <div className={css.radiobutton_container}>
          <SingleSelectBox
            onChange={txt => SetRadioState(txt)}
            status={radio_state}
            list={['タイトル', 'タグ', '説明', 'ID']}
          />
        </div>

        <div className={css.sort}>
          <p>{newer_first ? '新しい順' : '古い順'}に並べています。</p>
          <Button
            type='material'
            text={newer_first ? '古い順に並べる' : '新しい順に並べる'}
            icon={<SortIcon />}
            OnClick={() => SetNewerFirst(!newer_first)}
          />
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <IndexedContainer len={list.filter(e => e.deleted === show_only_trash).length} width='300px'>
          {CardList()}
        </IndexedContainer>
      )}

      <Modal isOpen={is_modal_open} close={() => SetIsModalOpen(false)}>
        <div className={css.add_category_window}>
          <h2>新規カテゴリの追加</h2>
          <Form label='タイトル' value={category_name} OnChange={ev => SetCategoryName(ev.target.value)} />
          <Form label='説明' value={category_desc} OnChange={ev => SetCategoryDesc(ev.target.value)} />
          <div className={css.button_container}>
            <Button type='material' icon={<CloseIcon />} text='キャンセル' OnClick={() => SetIsModalOpen(false)} />
            <Button
              type='filled'
              icon={<CheckIcon />}
              text='作成する'
              OnClick={() => {
                if (category_name === '') {
                  Toast.open('カテゴリのタイトルを設定してください');
                  return;
                }
                StartWaiting();
                new_category({
                  title: category_name,
                  description: category_desc,
                  list: JSON.stringify([
                    { type: 'Text', question: '問題文', question_choices: [''], answer: ['解答'], comment: '' },
                  ]),
                }).then(e => router.push(`/edit?id=${e.data.inserted_id}`));
              }}
            />
          </div>
        </div>
      </Modal>
      <Waiting />
    </>
  );
}
