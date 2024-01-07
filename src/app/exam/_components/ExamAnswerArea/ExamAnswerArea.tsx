// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './ExamAnswerArea.module.scss';
import React from 'react';
import {DragDropContext, Droppable, Draggable, DropResult} from '@hello-pangea/dnd';
import {ExamReducerContext} from '../ExamReducer';
import Form from '@/common/TextForm/Form';
import {SelectButton} from '@/common/SelectBox';
import ListIcon from '@assets/list.svg';

export function ExamAnswerArea(): JSX.Element {
  const [state, dispatch] = React.useContext(ExamReducerContext);
  const exam = state.exam[state.index];
  const status = state.exam_state[state.index];

  function ResultIndicator(props: {index: number}): JSX.Element {
    let classname = css.result_indicator_before_check;
    if (status.checked) {
      classname = status.result[props.index] ? css.result_indicator_correct : css.result_indicator_wrong;
    }
    return <div className={classname} />;
  }

  return (
    <>
      {(() => {
        switch (exam.type) {
          case undefined:
          case 'Text':
            return exam.answer.map((e, i) => (
              <div key={'text-' + i} className={css.item}>
                <ResultIndicator index={i} />
                <Form
                  label={exam.answer.length === 1 ? '解答' : `解答 (${i + 1})`}
                  value={status.user_answer[i]}
                  disabled={status.checked}
                  OnChange={ev => dispatch({type: 'text/set', at: i, data: ev.target.value})}
                />
              </div>
            ));
          case 'Select':
            return exam.question_choices?.map((e, i) => (
              <div key={'select-' + i} className={css.item}>
                <div
                  className={(() => {
                    // ここが本来の正解だった場合
                    if (status.checked && exam.answer[0] === String(i)) {
                      // 正解した（正しく選んだ）場合はcorrect
                      return status.correct_count === 1 ? css.result_indicator_correct : css.result_indicator_wrong;
                    }
                    return css.result_indicator_before_check;
                  })()}
                />
                <SelectButton
                  type='radio'
                  desc={e}
                  status={status.user_answer[0] === String(i)}
                  onChange={() => status.checked || dispatch({type: 'select/set', index: i})}
                />
              </div>
            ));
          case 'MultiSelect':
            return exam.question_choices?.map((e, i) => (
              <div key={'multiselect-' + i} className={css.item}>
                <ResultIndicator index={i} />
                <SelectButton
                  type='check'
                  desc={e}
                  status={status.user_answer.indexOf(String(i)) !== -1}
                  onChange={() => status.checked || dispatch({type: 'multi/toggle', index: i})}
                />
              </div>
            ));
          case 'Sort':
            return (
              <DragDropContext
                onDragEnd={(e: DropResult) => {
                  if (e.destination) {
                    dispatch({type: 'sort/move', from: e.source.index, to: e.destination.index});
                  }
                }}
              >
                <Droppable droppableId='examform_sort_item_droppable'>
                  {provided => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {status.user_answer.map((e, i) => {
                        const id = `exam-item-${i}`;
                        return (
                          <Draggable key={id} draggableId={id} index={i} isDragDisabled={status.checked}>
                            {provided => (
                              <div className={css.item} ref={provided.innerRef} {...provided.draggableProps}>
                                <ResultIndicator index={i} />
                                <div
                                  className={css.sort_item}
                                  id={i === 0 ? 'sort-first-draghandle' : ''}
                                  {...{sort_index: i}}
                                  {...provided.dragHandleProps}
                                >
                                  <span>{e}</span>
                                  <div className={css.drag_icon} {...provided.dragHandleProps}>
                                    <ListIcon />
                                  </div>
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
          default:
            throw Error(`invalid exam type (${state.index}: ${JSON.stringify(exam)})`);
        }
      })()}
    </>
  );
}
