// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
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
import {ComboBox} from '@/common/ComboBox/ComboBox';

const FIRST_ITEM = 'ExamFirstItem';

export function ExamAnswerArea(): JSX.Element {
  const [state, dispatch] = React.useContext(ExamReducerContext);
  const exam = state.exam[state.index];
  const status = state.exam_state[state.index];

  // keyboard shortcut
  React.useEffect(() => {
    const Shortcut = (e: KeyboardEvent) => {
      if (!e.ctrlKey || !e.shiftKey || e.repeat || status.checked) {
        return;
      }
      if (exam.type === 'Select' || exam.type === 'MultiSelect') {
        const num = e.code.match(/(Digit|Numpad)([1-9])/);
        if (!num || !num[2]) {
          return;
        }
        e.preventDefault();
        dispatch({type: exam.type === 'Select' ? 'select/set' : 'multi/toggle', index: Number(num[2]) - 1});
        return;
      }

      if (exam.type === 'Sort') {
        let direction = 0;
        // Ctrl + Shift + ↓↑ or jkで動かす
        switch (e.code) {
          case 'KeyJ':
          case 'ArrowDown':
            direction = 1;
            break;
          case 'KeyK':
          case 'ArrowUp':
            direction = -1;
            break;
          default:
            return;
        }
        e.preventDefault();
        // 一つ上下に移動させる
        const from_element = document.activeElement;
        const index = Number(from_element?.attributes.getNamedItem('sort_index')?.value);
        if (!Number.isInteger(index)) return;
        const to = index + direction;
        if (to < 0 || to >= exam.answer.length) return;
        dispatch({type: 'sort/move', from: index, to});
        // 移動先の要素にフォーカスする
        const to_element = document.querySelector<HTMLElement>(`[sort_index="${to}"]`);
        to_element?.focus();
        // アニメーションを発生させる
        if (to_element) {
          const e = to_element.parentElement;
          if (!e) return;
          e.animate(
            [{transform: `translateY(${(e.clientHeight + 20) * -direction}px)`}, {transform: 'translateY(0px)'}],
            {duration: 200, easing: 'ease-out'},
          );
        }
        if (from_element instanceof HTMLElement) {
          const e = from_element.parentElement;
          if (!e) return;
          e.animate(
            [{transform: `translateY(${(e.clientHeight + 20) * direction}px)`}, {transform: 'translateY(0px)'}],
            {duration: 200, easing: 'ease-out'},
          );
        }
      }
    };

    window.addEventListener('keydown', Shortcut);
    return () => window.removeEventListener('keydown', Shortcut);
  }, [state]);

  // ページ移動時、フォーカスする
  React.useEffect(() => {
    document.getElementById(FIRST_ITEM)?.focus();
  }, [exam]);

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
                  id={i === 0 ? FIRST_ITEM : ''}
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
                  id={i === 0 ? FIRST_ITEM : ''}
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
                  id={i === 0 ? FIRST_ITEM : ''}
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
                                  id={i === 0 ? FIRST_ITEM : ''}
                                  {...{sort_index: i}}
                                  {...provided.dragHandleProps}
                                >
                                  <span>{e}</span>
                                  <div className={css.drag_icon}>
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
          case 'ListSelect':
            return status.user_answer.map((e, i) => (
              <div className={css.item} key={'listselect-' + i}>
                <ResultIndicator index={i} />
                <div className={css.listselect_container}>
                  <span className={css.listselect_label}>{exam.answer.length === 1 ? '解答' : `解答 (${i + 1})`}</span>
                  <ComboBox
                    id={i === 0 ? FIRST_ITEM : ''}
                    disabled={status.checked}
                    value={e}
                    on_change={data => dispatch({type: 'text/set', at: i, data})}
                    options={(exam.question_choices ?? []).map(e => {
                      return {text: e, value: e};
                    })}
                  />
                </div>
              </div>
            ));
          default:
            throw Error(`invalid exam type (${state.index}: ${JSON.stringify(exam)})`);
        }
      })()}
    </>
  );
}
