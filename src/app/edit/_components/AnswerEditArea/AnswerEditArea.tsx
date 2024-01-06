// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './AnswerEditArea.module.scss';
import React from 'react';
import {DragDropContext, Droppable, Draggable, DropResult} from '@hello-pangea/dnd';
import {EditReducerContext} from '../EditReducer';
import {useShortcut} from '@utils/useShortcut';
import Form from '@/common/TextForm/Form';
import Button from '@/common/Button/Button';
import {TabIndexList} from '../Forms/ExamEditForms';
import {SelectButton} from '@/common/SelectBox';
import ArrowUpIcon from '@assets/arrow-up.svg';
import ArrowDownIcon from '@assets/arrow-down.svg';
import ListIcon from '@assets/list.svg';
import DeleteIcon from '@assets/delete.svg';

export function AnswerEditArea(): React.ReactElement {
  const [state, dispatch] = React.useContext(EditReducerContext);
  const exam = state.exam[state.current_editing];

  useShortcut([{keycode: 'KeyJ', handler: () => undefined}], {shift: true});

  const target_str = exam.type === 'Text' || exam.type === 'Sort' ? 'answer' : 'choice';
  const target_array = target_str === 'answer' ? exam.answer : exam.question_choices ?? [];
  return (
    <>
      <div className={css.button_container}>
        <Button
          type='material'
          icon={<ArrowUpIcon />}
          text='最初に挿入'
          OnClick={() => dispatch({type: `q:${target_str}/insert`, at: -1})}
        />
        <Button
          type='material'
          icon={<ArrowDownIcon />}
          text='最後に挿入'
          OnClick={() => dispatch({type: `q:${target_str}/insert`, at: target_array.length})}
        />
      </div>
      <DragDropContext
        onDragEnd={(e: DropResult) => {
          if (!e.destination) {
            return;
          }
          const from = e.source.index;
          const to = e.destination.index;
          dispatch({type: `q:${target_str}/move`, from, to});
          // if swapping elements is set as answer, replace an answer with new index
          if (exam.type === 'Select' && exam.answer[0] === String(from)) {
            dispatch({type: 'q:answer/set_single', index: to});
          }
          // if swapping elements is included in answer, remove old index and replace with new index
          if (exam.type === 'MultiSelect' && exam.answer.indexOf(String(from))) {
            dispatch({type: 'q:answer/toggle_multi', index: from});
            dispatch({type: 'q:answer/toggle_multi', index: to});
          }
        }}
      >
        <Droppable droppableId='examform_sort_droppable'>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {target_array.map((e, i) => {
                const id = `answer-sort-${i}`;
                return (
                  <Draggable key={id} draggableId={id} index={i}>
                    {provided => {
                      return (
                        <div className={css.editor_wrapper} ref={provided.innerRef} {...provided.draggableProps}>
                          <div className={css.check}>
                            {exam.type === 'Select' && (
                              <SelectButton
                                type='radio'
                                desc={''}
                                tabIndex={TabIndexList.SelectCorrectAnswer}
                                status={exam.answer[0] === String(i)}
                                onChange={() => dispatch({type: 'q:answer/set_single', index: i})}
                              />
                            )}
                            {exam.type === 'MultiSelect' && (
                              <SelectButton
                                type='check'
                                desc={''}
                                tabIndex={TabIndexList.SelectCorrectAnswer}
                                status={exam.answer.indexOf(String(i)) !== -1}
                                onChange={() => dispatch({type: 'q:answer/toggle_multi', index: i})}
                              />
                            )}
                          </div>
                          <div className={css.form}>
                            <Form
                              id={id}
                              label={`答え (${i + 1})`}
                              value={e}
                              layer={TabIndexList.Answer}
                              OnChange={ev => dispatch({type: `q:${target_str}/set`, index: i, data: ev.target.value})}
                            />
                          </div>
                          <div className={css.dragger} {...provided.dragHandleProps}>
                            <ListIcon />
                          </div>
                          <div className={css.button_container}>
                            <Button
                              text='1つ下に追加'
                              icon={<ArrowDownIcon />}
                              type='material'
                              OnClick={() => dispatch({type: `q:${target_str}/insert`, at: i + 1})}
                            />
                            {target_array.length !== 1 && (
                              <Button
                                text='削除'
                                icon={<DeleteIcon />}
                                type='material'
                                OnClick={() => dispatch({type: `q:${target_str}/remove`, at: i})}
                              />
                            )}
                          </div>
                        </div>
                      );
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
