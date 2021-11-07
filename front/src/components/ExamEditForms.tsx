// TAGether - Share self-made exam for classmates
// ExamEditForms.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from '../style/components/ExamEditForms.module.scss';
import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Exam from '../types/Exam';
import Form from './Form';
import Modal from './Modal';
import Button from './Button';
import CheckBox from './CheckBox';
import ButtonContainer from './ButtonContainer';
import ExamOperateFunctionsType from '../types/ExamOperateFunctionsType';
import ExamType from '../types/ExamType';

interface Props {
  exam: Exam[]
  updater: ExamOperateFunctionsType
  register: () => void
}

export default function ExamEditForms(props: Props): React.ReactElement {
  const [current_page, SetCurrentPage] = React.useState(0);
  const [is_modal_open, SetIsModalOpen] = React.useState(false);
  const question_form = React.useRef<HTMLTextAreaElement>();

  // ショートカットキー
  const Shortcut = React.useCallback((e: KeyboardEvent) => {
    // Ctrl+Shift+矢印キー等で動かす （キーリピートは無視）
    if (e.ctrlKey && e.shiftKey && !e.repeat) {
      if (e.code === 'KeyH' || e.code === 'ArrowLeft') {
        PrevPage();
      }
      else if (e.code === 'KeyL' || e.code === 'ArrowRight') {
        NextPage();
      }
    }
  }, []);

  function NextPage() {
    SetCurrentPage(current => {
      if (current === props.exam.length - 1) return current;
      return current + 1;
    });
    question_form.current?.focus();
  }
  function PrevPage() {
    SetCurrentPage(current => {
      if (current === 0) return current;
      return current - 1;
    });
    question_form.current?.focus();
  }

  function MovePageTo(to: number) {
    SetCurrentPage(current => {
      if (current < 0 || current > props.exam.length - 1) return current;
      return to;
    });
    question_form.current?.focus();
  }

  React.useEffect(() => {
    window.addEventListener('keydown', e => Shortcut(e));
    return () =>
      window.removeEventListener('keydown', e => Shortcut(e));
  }, [Shortcut]);

  function AddRemoveButtons(type: ExamType, index: number, length: number) {
    return (
      <>
        {/* 問題の追加/削除 */}
        <Button {...{
          text: '追加', icon: 'fas fa-plus', type: 'material',
          onClick: () => (type === 'Text' || type === 'Sort') ?
            props.updater.Answer.Insert(current_page, -1)
            :
            props.updater.QuestionChoices.Insert(current_page, -1)
        }} />
        {
          // 解答欄を1つ削除するボタン
          // 解答欄が1つしかないときは無効
          (length !== 1) &&
          <Button {...{
            type: 'material', icon: 'fas fa-trash', text: '削除',
            onClick: () => (type === 'Text' || type === 'Sort') ?
              props.updater.Answer.Remove(current_page, index)
              :
              props.updater.QuestionChoices.Remove(current_page, index)
          }} />
        }
      </>);
  }

  function AnswerEditArea() {
    let result: React.ReactElement[] | React.ReactElement;

    switch (props.exam[current_page].type ?? 'Text') {
      case 'Text':
        result = props.exam[current_page].answer.map((e, i) => {
          return (
            <div key={`examform-text-${i}`}>
              <Form label={`答え (${i + 1})`} value={e} rows={3}
                onChange={(ev) => props.updater.Answer.Update(current_page, i, ev.target.value)} />
              <div className={css.answer_area_buttons}>{AddRemoveButtons('Text', i, props.exam[current_page].answer.length)}</div>
            </div>
          );
        });
        break;

      case 'Select':
        // (length ?? 0) < 1にすることで、choicesが存在しなかった場合かならず初期化される
        if ((props.exam[current_page].question_choices?.length ?? 0) < 1) {
          props.exam[current_page].question_choices = [''];
          props.updater.Exam.Update();
        }
        result = props.exam[current_page].question_choices?.map((e, i) => {
          return (
            <div key={`examform-select-${i}`} >
              <div className={css.select_form}>
                <CheckBox desc={''} status={Number(props.exam[current_page].answer[0]) === i && props.exam[current_page].answer[0] !== ''}
                  onChange={(f) => {
                    if (!f) return;
                    if (props.exam[current_page].answer.length > 1) {
                      props.exam[current_page].answer = [''];
                      props.updater.Exam.Update();
                    }
                    props.updater.Answer.Update(current_page, 0, String(i));
                  }} />
                <Form value={e} rows={2}
                  onChange={(ev) => props.updater.QuestionChoices.Update(current_page, i, ev.target.value)} />
              </div>
              <div className={css.answer_area_buttons}>{AddRemoveButtons('Select', i, props.exam[current_page].question_choices?.length ?? 0)}</div>
            </div>
          );
        }) ?? <>invalid</>;
        break;

      case 'MultiSelect':
        // (length ?? 0) < 1にすることで、choicesが存在しなかった場合かならず初期化される
        if ((props.exam[current_page].question_choices?.length ?? 0) < 1) {
          props.exam[current_page].question_choices = [''];
          props.updater.Exam.Update();
        }
        result = props.exam[current_page].question_choices?.map((e, i) => {
          return (
            <div key={`examform-multiselect-${i}`}>
              <div className={css.select_form}>
                <CheckBox desc={''} status={props.exam[current_page].answer.indexOf(String(i)) !== -1}
                  onChange={(f) => {
                    // チェックが付けられた時は追加する
                    if (f) {
                      props.updater.Answer.Insert(current_page, -1, String(i));
                      // デフォルトで存在する空欄要素を排除
                      props.exam[current_page].answer = props.exam[current_page].answer.filter(e => e !== '');
                      props.updater.Exam.Update();
                    } else {
                      // チェックが外された時は該当要素を削除
                      props.exam[current_page].answer = props.exam[current_page].answer.filter(e => (e !== String(i) && e !== ''));
                      props.updater.Exam.Update();
                    }
                  }} />
                <Form value={e} rows={2}
                  onChange={(ev) => props.updater.QuestionChoices.Update(current_page, i, ev.target.value)} />
              </div>
              <div className={css.answer_area_buttons}>{AddRemoveButtons('MultiSelect', i, props.exam[current_page].question_choices?.length ?? 0)}</div>
            </div>
          );
        }) ?? <>invalid</>;
        break;

      case 'Sort':
        result = (
          <DragDropContext onDragEnd={(e: DropResult) => {
            if (!e.destination) return;
            const from = e.source.index, to = e.destination.index;
            if (from == to) return;
            const ans = props.exam[current_page].answer;
            ans.splice(to + ((from < to) ? 1 : 0), 0, ans[from]);
            ans.splice(from + ((from > to) ? 1 : 0), 1);
            props.exam[current_page].answer = ans;
            props.updater.Exam.Update();
          }}>
            <Droppable droppableId='examform_sort_droppable'>{provided => (
              <div ref={provided.innerRef} {...provided.innerRef}>{
                props.exam[current_page].answer.map((e, i) => {
                  const id = `examform-sort-${i}`;
                  return (
                    <Draggable key={id} draggableId={id} index={i}>{provided => (
                      <div className={css.sort_forms} ref={provided.innerRef}
                        {...provided.draggableProps}>
                        <Form label={`答え (${i + 1})`} value={e} rows={3}
                          onChange={(ev) => props.updater.Answer.Update(current_page, i, ev.target.value)} />
                        <span className={`fas fa-list ${css.icon}`}
                          {...provided.dragHandleProps} />
                        <div className={css.answer_area_buttons}>{AddRemoveButtons('Sort', i, props.exam[current_page].answer.length)}</div>
                      </div>
                    )}</Draggable>
                  );
                })
              }</div>
            )}
            </Droppable>
          </DragDropContext >
        );
        break;
    }
    return <>{result}</>;
  }

  return (
    <>
      <div className={css.button_list}>
        <div className={css.button_container}>
          <Button type={'material'} icon={'fas fa-angle-double-left'} text={''}
            onClick={() => MovePageTo(0)} />
          <Button type={'material'} icon={'fas fa-chevron-left'} text={''}
            onClick={PrevPage} />
          <span>{current_page + 1}/{props.exam.length}</span>
          <Button type={'material'} icon={'fas fa-chevron-right'} text={''}
            onClick={NextPage} />
          <Button type={'material'} icon={'fas fa-angle-double-right'} text={''}
            onClick={() => MovePageTo(props.exam.length - 1)} />
        </div>

        <div className={css.button_container}>
          <Button type={'material'} icon={'fas fa-trash'} text={'この問題を削除'}
            onClick={() => {
              if (current_page === props.exam.length - 1) PrevPage();
              props.updater.Exam.Remove(current_page);
            }} />
          <Button type={'material'} icon={'fas fa-list'} text={'問題一覧'}
            onClick={() => SetIsModalOpen(true)} />
        </div>

        <div className={css.append_exam}>
          <ButtonContainer>
            <Button type={'material'} icon={'fas fa-angle-double-left'} text={'最初に挿入'}
              onClick={() => { props.updater.Exam.Insert(0); SetCurrentPage(0); }} />
            <Button type={'material'} icon={'fas fa-arrow-left'} text={'1つ前に挿入'}
              onClick={() => props.updater.Exam.Insert(current_page)} />
            <Button type={'material'} icon={'fas fa-arrow-right'} text={'1つ後に挿入'}
              onClick={() => { props.updater.Exam.Insert(current_page + 1); NextPage(); }} />
            <Button type={'material'} icon={'fas fa-angle-double-right'} text={'最後に挿入'}
              onClick={() => { props.updater.Exam.Insert(-1); SetCurrentPage(props.exam.length - 1); }} />
          </ButtonContainer>
        </div>
      </div>

      {/* 問題文の編集欄（左側） */}
      <div className={css.form_container}>
        <div className={css.qa_list}>
          <Form
            label={'問題文'} value={props.exam[current_page].question} rows={6} reff={question_form}
            onChange={(ev) => props.updater.Question.Update(current_page, ev.target.value)}
          />
          <Form
            label={'コメント（解説など）'} value={props.exam[current_page].comment ?? ''} rows={5}
            onChange={(ev) => props.updater.Comment.Update(current_page, ev.target.value)}
          />
        </div>

        {/* 答え編集欄（右側） */}
        <div className={css.qa_list}>
          {/* 問題の形式を変更するチェックボックス */}
          <div className={css.type_select}>
            <CheckBox desc='テキスト' status={(props.exam[current_page].type ?? 'Text') === 'Text'}
              onChange={() => props.updater.Type.Update(current_page, 'Text')} />
            <CheckBox desc='選択問題' status={(props.exam[current_page].type ?? 'Text') === 'Select'}
              onChange={() => props.updater.Type.Update(current_page, 'Select')} />
            <CheckBox desc='複数選択' status={(props.exam[current_page].type ?? 'Text') === 'MultiSelect'}
              onChange={() => props.updater.Type.Update(current_page, 'MultiSelect')} />
            <CheckBox desc='並び替え' status={(props.exam[current_page].type ?? 'Text') === 'Sort'}
              onChange={() => props.updater.Type.Update(current_page, 'Sort')} />
          </div>
          {AnswerEditArea()}
        </div>
      </div>

      <Modal isOpen={is_modal_open} close={() => SetIsModalOpen(false)}>
        <div className={css.modal}>
          <p>クリックして問題に移動</p>
          <p>右のアイコンをドラッグすると並び替えができます</p>
          <DragDropContext onDragEnd={(e: DropResult) => {
            if (!e.destination) return;
            const from = e.source.index, to = e.destination.index;
            if (from == to) return;
            const exam = props.exam;
            exam.splice(to + ((from < to) ? 1 : 0), 0, exam[from]);
            exam.splice(from + ((from > to) ? 1 : 0), 1);
            props.updater.Exam.Update();
          }}>

            <Droppable droppableId={'question_list'}>
              {provided => (
                <div
                  className={css.question_list}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {
                    props.exam.map((e, i) => {
                      return (
                        <Draggable key={`draggable_${i}-${e.question.slice(0, 5)}`}
                          draggableId={`${i}-${e.question.slice(0, 5)}`}
                          index={i}
                        >
                          {provided => (
                            <div
                              className={css.dragable_question_card}
                              ref={provided.innerRef}
                              onClick={() => { SetCurrentPage(i); SetIsModalOpen(false); }}
                              {...provided.draggableProps}
                            >
                              <span>{`${e.question.slice(0, 75)}${(e.question.length > 75) ? '...' : ''}`}</span>
                              <span className={`fas fa-list ${css.icon}`}
                                {...provided.dragHandleProps} />
                            </div>
                          )}
                        </Draggable>
                      );
                    })
                  }
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

          </DragDropContext>

          <div className={css.button_container}>
            <Button type={'filled'} icon={'fas fa-times'} text={'閉じる'}
              onClick={() => SetIsModalOpen(false)} />
          </div>

        </div>
      </Modal>
    </>
  );
}