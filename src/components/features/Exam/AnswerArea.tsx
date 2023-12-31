// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './AnswerArea.module.scss';
import {DragDropContext, Droppable, Draggable, DropResult} from '@hello-pangea/dnd';
import {useSearchParams} from 'next/navigation';
import React from 'react';
import {SelectButton} from '@/common/SelectBox';
import Form from '@/common/TextForm/Form';
import {Move, Shuffle} from '@utils/ArrayUtil';
import {exam_default} from '@utils/DefaultValue';
import Exam from '@mytypes/Exam';
import ListIcon from '@assets/list.svg';

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
  const search_params = useSearchParams();
  const exam_ref = React.useRef<Exam>(exam_default()[0]);
  exam_ref.current = props.exam;

  const answers_ref = React.useRef<string[]>([]);
  answers_ref.current = props.answers;

  // ショートカットキー
  React.useEffect(() => {
    const Shortcut = (e: KeyboardEvent) => {
      if (!e.ctrlKey || !e.shiftKey || e.repeat || props.disable) {
        return;
      }

      if (exam_ref.current.type === 'Select' || exam_ref.current.type === 'MultiSelect') {
        const num = e.code.match(/(Digit|Numpad)([1-9])/);
        if (!num || !num[2]) {
          return;
        }
        switch (exam_ref.current.type) {
          case 'Select':
            set_select_choice(Number(num[2]) - 1);
            break;
          case 'MultiSelect':
            toggle_multi_select(Number(num[2]) - 1);
            break;
        }
        e.preventDefault();
        return;
      }

      if (exam_ref.current.type !== 'Sort') {
        return;
      }
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
    };

    window.addEventListener('keydown', Shortcut);
    return () => window.removeEventListener('keydown', Shortcut);
  }, [props.answers]);

  const set_select_choice = React.useCallback(
    (index: number) => {
      if (props.disable) return;
      props.setAnswers([String(index)]);
    },
    [props.disable],
  );

  const toggle_multi_select = React.useCallback(
    (index: number) => {
      if (props.disable || index >= (props.exam.question_choices?.length ?? 0)) return;
      let tmp = props.answers.concat();
      if (tmp.includes(String(index))) {
        tmp = tmp.filter(e => e !== String(index));
      } else {
        tmp.push(String(index));
      }
      props.setAnswers(tmp);
    },
    [props.disable, props.answers],
  );

  const question_choices = React.useMemo(() => {
    const list =
      props.exam.question_choices?.map((e, i) => {
        return {index: i, choice: e};
      }) ?? [];
    return search_params.get('choiceShuffle') === 'true' ? Shuffle(list) : list;
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
                type='radio'
                id={i === 0 ? 'select-first' : ''}
                desc={choice.choice}
                status={Number(props.answers[0]) === choice.index && props.answers[0] !== ''}
                onChange={f => {
                  if (f) {
                    set_select_choice(choice.index);
                  }
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
                type='check'
                id={i === 0 ? 'select-first' : ''}
                desc={choice.choice}
                status={props.answers.indexOf(String(choice.index)) !== -1}
                onChange={() => toggle_multi_select(choice.index)}
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
                          <div
                            className={css.icon}
                            id={i === 0 ? 'sort-first-draghandle' : ''}
                            {...{sort_index: i}}
                            {...provided.dragHandleProps}
                          >
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
      );
  } // switch(props.exam.type)
}
