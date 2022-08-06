// TAGether - Share self-made exam for classmates
// AnswerArea.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './AnswerArea.module.scss';
import {useRouter} from 'next/router';
import React from 'react';
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';
import {SelectButton} from '@/common/SelectBox';
import Form from '@/common/TextForm/Form';
import {Move, Shuffle} from '@/utils/ArrayUtil';
import {exam_default} from '@/utils/DefaultValue';
import Exam from '@mytypes/Exam';

interface Props {
  version: number;
  index: number;
  exam: Exam;
  disable: boolean;
  shortcutDisable: boolean;
  answers: string[];
  setAnswers: (list: string[]) => void;
}

export const FORM_ID = 'ExamFirstQuestion';

export function AnswerArea(props: Props): JSX.Element {
  const router = useRouter();
  const exam_ref = React.useRef<Exam>(exam_default()[0]);
  exam_ref.current = props.exam;

  const answers_ref = React.useRef<string[]>([]);
  answers_ref.current = props.answers;

  // ショートカットキー
  const Shortcut = React.useCallback(
    (e: KeyboardEvent) => {
      // Ctrl + Shift + ↓↑ or jkで動かす
      if (e.ctrlKey && e.shiftKey && !e.repeat && !props.disable) {
        let direction = 0;
        switch (e.code) {
          case 'KeyJ':
          case 'ArrowDown':
            e.preventDefault();
            direction = 1;
            break;
          case 'KeyK':
          case 'ArrowUp':
            e.preventDefault();
            direction = -1;
            break;
          default:
            return;
        }
        if (exam_ref.current.type !== 'Sort') return;
        // 一つ上下に移動させる
        const from_element = document.activeElement;
        const index = Number(from_element?.attributes.getNamedItem('sort_index')?.value);
        if (Number.isNaN(index)) return;
        const to = index + direction;
        if (to < 0 || to >= exam_ref.current.answer.length) return;
        MoveAnswerOnSort(index, to);
        // 移動先の要素にフォーカスする
        const to_element = document.querySelector<HTMLElement>(`[sort_index="${to}"]`);
        to_element?.focus();
        // アニメーションを発生させる
        if (to_element) {
          const e = to_element.parentElement;
          if (!e) return;
          e.animate(
            [{transform: `translateY(${(e.clientHeight + 20) * -direction}px)`}, {transform: 'translateY(0px)'}],
            {duration: 300, easing: 'ease-out'},
          );
        }
        if (from_element instanceof HTMLElement) {
          const e = from_element.parentElement;
          if (!e) return;
          // prettier-ignore
          e.animate(
            [{ transform: `translateY(${(e.clientHeight + 20) * direction}px)` }, { transform: 'translateY(0px)' }],
            { duration: 300, easing: 'ease-out' }
          );
        }
      }
    },
    [props.answers],
  );
  React.useEffect(() => {
    window.addEventListener('keydown', Shortcut);
    return () => window.removeEventListener('keydown', Shortcut);
  }, []);

  const question_choices = React.useMemo(() => {
    const list =
      props.exam.question_choices?.map((e, i) => {
        return {index: i, choice: e};
      }) ?? [];
    return router.query.choiceShuffle === 'true' ? Shuffle(list) : list;
  }, [props.index]);

  const MoveAnswerOnSort = (from: number, to: number) => {
    if (from === to) return;
    props.setAnswers(Move(answers_ref.current, from, to));
  };

  // バージョン1であれば強制的にText扱いとする
  const type = props.version === 1 ? 'Text' : props.exam.type ?? 'Text';

  switch (type) {
    case 'Text':
      return (
        <>
          {props.exam.answer.map((e, i) => (
            <div className={css.form} key={`examform_Text_${i}`}>
              <Form
                id={FORM_ID}
                rows={1}
                label={`解答 ${props.exam.answer.length === 1 ? '' : `(${i + 1})`}`}
                value={props.answers[i]}
                OnChange={ev => {
                  const tmp = props.answers.concat();
                  tmp[i] = ev.target.value;
                  props.setAnswers(tmp);
                }}
                disabled={props.disable}
              />
            </div>
          ))}
        </>
      );

    case 'Select':
      return (
        <>
          {question_choices.map((choice, i) => (
            <div className={css.select_button} key={`examform_checkbox_${i}`}>
              <SelectButton
                type='single'
                id={i === 0 ? 'select-first' : ''}
                desc={choice.choice}
                status={Number(props.answers[0]) === choice.index && props.answers[0] !== ''}
                onChange={f => {
                  if (!f || props.disable) return;
                  props.setAnswers([String(choice.index)]);
                }}
              />
            </div>
          ))}
        </>
      );

    case 'MultiSelect':
      return (
        <>
          {question_choices.map((choice, i) => (
            <div className={css.select_button} key={`examform_checkbox_${i}`}>
              <SelectButton
                type='multi'
                id={i === 0 ? 'select-first' : ''}
                desc={choice.choice}
                status={props.answers.indexOf(String(choice.index)) !== -1}
                onChange={f => {
                  if (props.disable) return;
                  let tmp = props.answers.concat();
                  if (f) {
                    tmp.push(String(choice.index));
                  } else {
                    tmp = tmp.filter(e => e !== String(choice.index));
                  }
                  props.setAnswers(tmp);
                }}
              />
            </div>
          ))}
        </>
      );

    case 'Sort':
      return (
        <DragDropContext
          onDragEnd={(e: DropResult) => {
            if (!e.destination) return;
            MoveAnswerOnSort(e.source.index, e.destination.index);
          }}
        >
          <Droppable droppableId='examform_sort_item_droppable'>
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {props.answers.map((e, i) => {
                  const id = `exam-item-${i}`;
                  return (
                    <Draggable key={id} draggableId={id} index={i} isDragDisabled={props.disable}>
                      {provided => (
                        <div className={css.examform_sort_item} ref={provided.innerRef} {...provided.draggableProps}>
                          <span>{e}</span>
                          <span
                            className={`fas fa-list ${css.icon}`}
                            id={i === 0 ? 'sort-first-draghandle' : ''}
                            {...{sort_index: i}}
                            {...provided.dragHandleProps}
                          />
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
  } // switch(props.exam.type)
}
