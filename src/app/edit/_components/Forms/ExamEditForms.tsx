// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './ExamEditForms.module.scss';
import React from 'react';
import {DragDropContext, Droppable, Draggable, DropResult} from '@hello-pangea/dnd';
import {EditReducerContext} from '../EditReducer';
import Button from '@/common/Button/Button';
import ButtonContainer from '@/common/Button/ButtonContainer';
import Modal from '@/common/Modal/Modal';
import Form from '@/common/TextForm/Form';
import Loading from '../../loading';
import {useShortcut} from '@utils/useShortcut';
import {AnswerEditArea} from '../AnswerEditArea/AnswerEditArea';
import ArrowLeftIcon from '@assets/arrow-left.svg';
import ArrowRightIcon from '@assets/arrow-right.svg';
import ChevronLeftIcon from '@assets/chevron-left.svg';
import ChevronRightIcon from '@assets/chevron-right.svg';
import DoubleChevronLeftIcon from '@assets/double-chevron-left.svg';
import DoubleChevronRightIcon from '@assets/double-chevron-right.svg';
import DeleteIcon from '@assets/delete.svg';
import ListIcon from '@assets/list.svg';
import CloseIcon from '@assets/close.svg';
import {ComboBox} from '@/common/ComboBox/ComboBox';
import ExamType from '@mytypes/ExamType';

export enum TabIndexList {
  TypeSelect = 1,
  Question,
  Answer,
  SelectCorrectAnswer,
  Comment,
}

const QUESTION_ID = 'ExamEdit_Question';

export default function ExamEditForms(): React.ReactElement {
  const [state, dispatch] = React.useContext(EditReducerContext);
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
  useShortcut(
    [
      {keycode: 'KeyH', handler: () => step_page_with_adding(-1)},
      {keycode: 'ArrowLeft', handler: () => step_page_with_adding(-1)},
      {keycode: 'KeyL', handler: () => step_page_with_adding(1)},
      {keycode: 'ArrowRight', handler: () => step_page_with_adding(1)},
      {keycode: 'KeyA', handler: () => dispatch({type: 'q:type/set', data: 'Text'})},
      {keycode: 'KeyS', handler: () => dispatch({type: 'q:type/set', data: 'Select'})},
      {keycode: 'KeyZ', handler: () => dispatch({type: 'q:type/set', data: 'MultiSelect'})},
      {keycode: 'KeyX', handler: () => dispatch({type: 'q:type/set', data: 'Sort'})},
    ],
    {ctrl: true, shift: true},
  );

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

  if (!state.exam[state.current_editing]) {
    return <Loading />;
  }

  return (
    <>
      <div className={css.button_list}>
        <div className={css.button_container}>
          <Button
            variant={'material'}
            icon={<DoubleChevronLeftIcon />}
            text={''}
            OnClick={() => dispatch({type: 'index/first'})}
          />
          <Button variant={'material'} icon={<ChevronLeftIcon />} text={''} OnClick={() => step_page_with_adding(-1)} />
          <span className={css.current_editing}>
            {state.current_editing + 1}/{exam_len}
          </span>
          <Button variant={'material'} icon={<ChevronRightIcon />} text={''} OnClick={() => step_page_with_adding(1)} />
          <Button
            variant={'material'}
            icon={<DoubleChevronRightIcon />}
            text={''}
            OnClick={() => dispatch({type: 'index/last'})}
          />
        </div>

        <div className={css.button_container}>
          <Button
            variant={'material'}
            icon={<DeleteIcon />}
            text={'この問題を削除'}
            OnClick={() => {
              if (state.current_editing === exam_len - 1) {
                dispatch({type: 'index/prev'});
              }
              dispatch({type: 'exam/remove', at: state.current_editing});
            }}
          />
          <Button variant={'material'} icon={<ListIcon />} text={'問題一覧'} OnClick={() => SetIsModalOpen(true)} />
        </div>

        <div className={css.append_exam}>
          <ButtonContainer>
            <Button
              variant='material'
              icon={<DoubleChevronLeftIcon />}
              text='最初に挿入'
              OnClick={() => {
                dispatch({type: 'exam/insert', at: -1});
                dispatch({type: 'index/jump', at: 0});
              }}
            />
            <Button
              variant='material'
              icon={<ArrowLeftIcon />}
              text='1つ前に挿入'
              OnClick={() => dispatch({type: 'exam/insert', at: state.current_editing})}
            />
            <Button
              variant='material'
              icon={<ArrowRightIcon />}
              text='1つ後に挿入'
              OnClick={() => {
                dispatch({type: 'exam/insert', at: state.current_editing + 1});
                dispatch({type: 'index/next'});
              }}
            />
            <Button
              variant='material'
              icon={<DoubleChevronRightIcon />}
              text='最後に挿入'
              OnClick={() => {
                dispatch({type: 'exam/insert', at: state.exam.length});
                dispatch({type: 'index/jump', at: state.exam.length + 1});
              }}
            />
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
            layer={TabIndexList.Question}
            OnChange={e => dispatch({type: 'q:question/set', data: e.target.value})}
          />
          <Form
            label={'コメント（解説など）'}
            value={state.exam[state.current_editing].comment ?? ''}
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
          <ComboBox
            value={state.exam[state.current_editing].type ?? 'Text'}
            on_change={data => dispatch({type: 'q:type/set', data: data as ExamType})}
            options={
              // prettier-ignore
              [
                {value: 'Text',        text: 'テキスト'},
                {value: 'Select',      text: '選択問題'},
                {value: 'MultiSelect', text: '複数選択'},
                {value: 'Sort',        text: '並び替え'},
                {value: 'ListSelect',  text: '一覧からの選択問題'},
              ]
            }
          />
          <AnswerEditArea />
        </div>
      </div>

      <Modal isOpen={is_modal_open} close={() => SetIsModalOpen(false)}>
        <div className={css.modal}>
          <p className={css.modal_desc}>
            クリックすると問題に移動します。右のアイコンをドラッグすると並び替えができます。
          </p>
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
                            <div className={css.icon} {...provided.dragHandleProps}>
                              <ListIcon />
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

          <div className={css.button_container}>
            <Button variant={'filled'} icon={<CloseIcon />} text={'閉じる'} OnClick={() => SetIsModalOpen(false)} />
          </div>
        </div>
      </Modal>
    </>
  );
}
