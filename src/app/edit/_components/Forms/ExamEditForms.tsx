// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './ExamEditForms.module.scss';
import React from 'react';
import {DragDropContext, Droppable, Draggable, DropResult} from '@hello-pangea/dnd';
import {ExamReducerContext} from '../EditReducer';
import Button from '@/common/Button/Button';
import ButtonContainer from '@/common/Button/ButtonContainer';
import Modal from '@/common/Modal/Modal';
import {SelectButton} from '@/common/SelectBox';
import Form from '@/common/TextForm/Form';
import ButtonInfo from '@mytypes/ButtonInfo';
import ExamType from '@mytypes/ExamType';
import Loading from '../../loading';

enum TabIndexList {
  TypeSelect = 1,
  Question,
  Answer,
  SelectCorrectAnswer,
  Comment,
}

const QUESTION_ID = 'ExamEdit_Question';

export default function ExamEditForms(): React.ReactElement {
  const [state, dispatch] = React.useContext(ExamReducerContext);
  const exam_len = state.exam.length;
  const is_first_rendering = React.useRef(true);
  const [is_modal_open, SetIsModalOpen] = React.useState(false);

  const step_page_with_adding = React.useCallback(
    (dir: 1 | -1) => {
      if (dir === -1 && state.current_editing === 0) {
        dispatch({type: 'exam/insert', at: 0});
        return;
      }
      if (dir === 1 && state.current_editing === state.exam.length - 1) {
        dispatch({type: 'exam/insert', at: state.exam.length});
      }
      dispatch({type: dir === -1 ? 'index/prev' : 'index/next'});
    },
    [state.current_editing],
  );

  // ショートカットキー
  React.useEffect(() => {
    const Shortcut = (e: KeyboardEvent) => {
      // Ctrl+Shift+矢印キー等で動かす （キーリピートは無視）
      if (e.ctrlKey && e.shiftKey && !e.repeat) {
        switch (e.code) {
          case 'KeyH':
          case 'ArrowLeft':
            step_page_with_adding(-1);
            break;
          case 'KeyL':
          case 'ArrowRight':
            step_page_with_adding(1);
            break;
          case 'KeyA':
            dispatch({type: 'q:type/set', data: 'Text'});
            break;
          case 'KeyS':
            dispatch({type: 'q:type/set', data: 'Select'});
            break;
          case 'KeyZ':
            dispatch({type: 'q:type/set', data: 'MultiSelect'});
            break;
          case 'KeyX':
            dispatch({type: 'q:type/set', data: 'Sort'});
            break;
          default:
            return;
        }
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', Shortcut);
    return () => window.removeEventListener('keydown', Shortcut);
  }, [state]);

  React.useEffect(() => {
    is_first_rendering.current = true;
  }, []);
  React.useEffect(() => {
    if (is_first_rendering.current) {
      is_first_rendering.current = false;
      return;
    }
    document.getElementById(QUESTION_ID)?.focus();
  }, [state.current_editing]);

  function AddRemoveButtons(type: ExamType, index: number, length: number) {
    return (
      <>
        {/* 問題の追加/削除 */}
        <Button
          {...{
            text: '1つ下に追加',
            icon: 'fas fa-plus',
            type: 'material',
            OnClick: () =>
              dispatch({
                type: type === 'Text' || type === 'Sort' ? 'q:answer/insert' : 'q:choice/insert',
                at: index + 1,
              }),
          }}
        />
        <Button
          {...{
            text: '最後に追加',
            icon: 'fas fa-arrow-down',
            type: 'material',
            OnClick: () =>
              dispatch({
                type: type === 'Text' || type === 'Sort' ? 'q:answer/insert' : 'q:choice/insert',
                at: length,
              }),
          }}
        />
        {
          // 解答欄を1つ削除するボタン
          // 解答欄が1つしかないときは無効
          length !== 1 && (
            <Button
              {...{
                type: 'material',
                icon: 'fas fa-trash',
                text: '削除',
                OnClick: () =>
                  dispatch({
                    type: type === 'Text' || type === 'Sort' ? 'q:answer/remove' : 'q:choice/remove',
                    at: index,
                  }),
              }}
            />
          )
        }
      </>
    );
  }

  function AnswerEditArea() {
    let result: React.ReactElement[] | React.ReactElement;
    const type = state.exam[state.current_editing].type ?? 'Text';

    switch (type) {
      case 'Text':
        result = state.exam[state.current_editing].answer.map((e, i) => {
          return (
            <div key={`examform-text-${i}`}>
              <Form
                label={`答え (${i + 1})`}
                value={e}
                rows={3}
                layer={TabIndexList.Answer}
                OnChange={e => dispatch({type: 'q:answer/set', index: i, data: e.target.value})}
              />
              <div className={css.answer_area_buttons}>
                {AddRemoveButtons('Text', i, state.exam[state.current_editing].answer.length)}
              </div>
            </div>
          );
        });
        break;

      case 'Select':
        result = state.exam[state.current_editing].question_choices?.map((e, i) => {
          return (
            <div key={`examform-select-${i}`}>
              <div className={css.select_form}>
                <SelectButton
                  type='radio'
                  desc={''}
                  tabIndex={TabIndexList.SelectCorrectAnswer}
                  status={
                    Number(state.exam[state.current_editing].answer[0]) === i &&
                    state.exam[state.current_editing].answer[0] !== ''
                  }
                  onChange={() => dispatch({type: 'q:answer/set_single', data: String(i)})}
                />
                <Form
                  value={e}
                  rows={2}
                  layer={TabIndexList.Answer}
                  OnChange={ev => dispatch({type: 'q:choice/set', index: i, data: ev.target.value})}
                />
              </div>
              <div className={css.answer_area_buttons}>
                {AddRemoveButtons('Select', i, state.exam[state.current_editing].question_choices?.length ?? 0)}
              </div>
            </div>
          );
        }) ?? <>invalid</>;
        break;

      case 'MultiSelect':
        result = state.exam[state.current_editing].question_choices?.map((e, i) => {
          return (
            <div key={`examform-multiselect-${i}`}>
              <div className={css.select_form}>
                <SelectButton
                  type='check'
                  desc={''}
                  tabIndex={TabIndexList.SelectCorrectAnswer}
                  status={state.exam[state.current_editing].answer.indexOf(String(i)) !== -1}
                  onChange={() => dispatch({type: 'q:answer/toggle_multi', data: String(i)})}
                />
                <Form
                  value={e}
                  rows={2}
                  layer={TabIndexList.Answer}
                  OnChange={ev => dispatch({type: 'q:choice/set', index: i, data: ev.target.value})}
                />
              </div>
              <div className={css.answer_area_buttons}>
                {AddRemoveButtons('MultiSelect', i, state.exam[state.current_editing].question_choices?.length ?? 0)}
              </div>
            </div>
          );
        }) ?? <>invalid</>;
        break;

      case 'Sort':
        result = (
          <DragDropContext
            onDragEnd={(e: DropResult) => {
              if (e.destination) {
                dispatch({type: 'q:answer/move', from: e.source.index, to: e.destination.index});
              }
            }}
          >
            <Droppable droppableId='examform_sort_droppable'>
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {state.exam[state.current_editing].answer.map((e, i) => {
                    const id = `examform-sort-${i}`;
                    return (
                      <Draggable key={id} draggableId={id} index={i}>
                        {provided => (
                          <div className={css.sort_forms} ref={provided.innerRef} {...provided.draggableProps}>
                            <Form
                              label={`答え (${i + 1})`}
                              value={e}
                              rows={3}
                              layer={TabIndexList.Answer}
                              OnChange={ev => dispatch({type: 'q:answer/set', index: i, data: ev.target.value})}
                            />
                            <span className={`fas fa-list ${css.icon}`} {...provided.dragHandleProps} />
                            <div className={css.answer_area_buttons}>
                              {AddRemoveButtons('Sort', i, state.exam[state.current_editing].answer.length)}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        );
        break;
    }
    return <>{result}</>;
  }

  const append_exam_button: ButtonInfo[] = [
    {
      type: 'material',
      icon: 'fas fa-angle-double-left',
      text: '最初に挿入',
      OnClick: () => dispatch({type: 'exam/insert', at: -1}),
    },
    {
      type: 'material',
      icon: 'fas fa-arrow-left',
      text: '1つ前に挿入',
      OnClick: () => dispatch({type: 'exam/insert', at: state.current_editing}),
    },
    {
      type: 'material',
      icon: 'fas fa-arrow-right',
      text: '1つ後に挿入',
      OnClick: () => dispatch({type: 'exam/insert', at: state.current_editing + 1}),
    },
    {
      type: 'material',
      icon: 'fas fa-angle-double-right',
      text: '最後に挿入',
      OnClick: () => dispatch({type: 'exam/insert', at: state.exam.length}),
    },
  ];

  if (!state.exam[state.current_editing]) {
    return <Loading />;
  }

  return (
    <>
      <div className={css.button_list}>
        <div className={css.button_container}>
          <Button
            type={'material'}
            icon={'fas fa-angle-double-left'}
            text={''}
            OnClick={() => dispatch({type: 'index/first'})}
          />
          <Button type={'material'} icon={'fas fa-chevron-left'} text={''} OnClick={() => step_page_with_adding(-1)} />
          <span className={css.current_editing}>
            {state.current_editing + 1}/{exam_len}
          </span>
          <Button type={'material'} icon={'fas fa-chevron-right'} text={''} OnClick={() => step_page_with_adding(1)} />
          <Button
            type={'material'}
            icon={'fas fa-angle-double-right'}
            text={''}
            OnClick={() => dispatch({type: 'index/last'})}
          />
        </div>

        <div className={css.button_container}>
          <Button
            type={'material'}
            icon={'fas fa-trash'}
            text={'この問題を削除'}
            OnClick={() => {
              if (state.current_editing === exam_len - 1) {
                dispatch({type: 'index/prev'});
              }
              dispatch({type: 'exam/remove', at: state.current_editing});
            }}
          />
          <Button type={'material'} icon={'fas fa-list'} text={'問題一覧'} OnClick={() => SetIsModalOpen(true)} />
        </div>

        <div className={css.append_exam}>
          <ButtonContainer>
            {append_exam_button.map(e => (
              <Button key={`append_exam_button_${e.text}`} {...e} />
            ))}
          </ButtonContainer>
        </div>
      </div>

      {/* 問題文の編集欄（左側） */}
      <div className={css.form_container}>
        <div className={css.qa_list}>
          <Form
            id={QUESTION_ID}
            label={'問題文'}
            value={state.exam[state.current_editing].question}
            rows={6}
            layer={TabIndexList.Question}
            OnChange={e => dispatch({type: 'q:question/set', data: e.target.value})}
          />
          <Form
            label={'コメント（解説など）'}
            value={state.exam[state.current_editing].comment ?? ''}
            rows={5}
            OnChange={e => dispatch({type: 'q:comment/set', data: e.target.value})}
            layer={TabIndexList.Comment}
          />
        </div>

        {/* 答え編集欄（右側） */}
        <div className={css.qa_list}>
          {/* 
            問題の形式を変更するチェックボックス 
            表示される文字列と、実際に設定される値が異なるため、一つずつ付けている
          */}
          <div className={css.type_select}>
            <SelectButton
              type='radio'
              desc='テキスト'
              tabIndex={TabIndexList.TypeSelect}
              status={(state.exam[state.current_editing].type ?? 'Text') === 'Text'}
              onChange={() => dispatch({type: 'q:type/set', data: 'Text'})}
            />
            <SelectButton
              type='radio'
              desc='選択問題'
              tabIndex={TabIndexList.TypeSelect}
              status={(state.exam[state.current_editing].type ?? 'Text') === 'Select'}
              onChange={() => dispatch({type: 'q:type/set', data: 'Select'})}
            />
            <SelectButton
              type='radio'
              desc='複数選択'
              tabIndex={TabIndexList.TypeSelect}
              status={(state.exam[state.current_editing].type ?? 'Text') === 'MultiSelect'}
              onChange={() => dispatch({type: 'q:type/set', data: 'MultiSelect'})}
            />
            <SelectButton
              type='radio'
              desc='並び替え'
              tabIndex={TabIndexList.TypeSelect}
              status={(state.exam[state.current_editing].type ?? 'Text') === 'Sort'}
              onChange={() => dispatch({type: 'q:type/set', data: 'Sort'})}
            />
          </div>
          {AnswerEditArea()}
        </div>
      </div>

      <Modal isOpen={is_modal_open} close={() => SetIsModalOpen(false)}>
        <div className={css.modal}>
          <p>クリックして問題に移動</p>
          <p>右のアイコンをドラッグすると並び替えができます</p>
          <DragDropContext
            onDragEnd={(e: DropResult) => {
              if (e.destination) {
                dispatch({type: 'exam/move', from: e.source.index, to: e.destination.index});
              }
            }}
          >
            <Droppable droppableId={'question_list'}>
              {provided => (
                <div className={css.question_list} ref={provided.innerRef} {...provided.droppableProps}>
                  {state.exam.map((e, i) => {
                    return (
                      <Draggable
                        key={`draggable_${i}-${e.question.slice(0, 5)}`}
                        draggableId={`${i}-${e.question.slice(0, 5)}`}
                        index={i}
                      >
                        {provided => (
                          <div
                            className={css.dragable_question_card}
                            ref={provided.innerRef}
                            onClick={() => {
                              dispatch({type: 'index/jump', at: i});
                              SetIsModalOpen(false);
                            }}
                            {...provided.draggableProps}
                          >
                            <span className={css.q_index}>{i + 1}</span>
                            <span>{`${e.question.slice(0, 75)}${e.question.length > 75 ? '...' : ''}`}</span>
                            <span className={`fas fa-list ${css.icon}`} {...provided.dragHandleProps} />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className={css.button_container}>
            <Button type={'filled'} icon={'fas fa-times'} text={'閉じる'} OnClick={() => SetIsModalOpen(false)} />
          </div>
        </div>
      </Modal>
    </>
  );
}
