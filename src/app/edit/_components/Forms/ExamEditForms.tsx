// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import css from './ExamEditForms.module.scss';
import {ExamContext} from '../../page';
import {DragDropContext, Droppable, Draggable, DropResult} from '@hello-pangea/dnd';
import React from 'react';
import Button from '@/common/Button/Button';
import ButtonContainer from '@/common/Button/ButtonContainer';
import Modal from '@/common/Modal/Modal';
import {SelectButton} from '@/common/SelectBox';
import Form from '@/common/TextForm/Form';
import {Move} from '@utils/ArrayUtil';
import UpdateExam from '@utils/UpdateExam';
import ButtonInfo from '@mytypes/ButtonInfo';
import Exam from '@mytypes/Exam';
import ExamType from '@mytypes/ExamType';

interface Props {
  updater: (e: Exam[]) => void;
}

enum TabIndexList {
  TypeSelect = 1,
  Question,
  Answer,
  SelectCorrectAnswer,
  Comment,
}

const QUESTION_ID = 'ExamEdit_Question';

export default function ExamEditForms(props: Props): React.ReactElement {
  const is_first_rendering = React.useRef(true);
  const [is_modal_open, SetIsModalOpen] = React.useState(false);

  const [current_page, SetCurrentPage] = React.useState(0);

  const exam = React.useContext(ExamContext);
  const exam_length = React.useRef(0);
  exam_length.current = exam.length;

  const updater = UpdateExam(props.updater, exam.concat());

  // ショートカットキー
  React.useEffect(() => {
    const Shortcut = (e: KeyboardEvent) => {
      // Ctrl+Shift+矢印キー等で動かす （キーリピートは無視）
      if (e.ctrlKey && e.shiftKey && !e.repeat) {
        switch (e.code) {
          case 'KeyH':
          case 'ArrowLeft':
            MovePageTo(current_page - 1);
            break;
          case 'KeyL':
          case 'ArrowRight':
            MovePageTo(current_page + 1);
            break;
          case 'KeyA':
            updater.Type.Update(current_page, 'Text');
            break;
          case 'KeyS':
            updater.Type.Update(current_page, 'Select');
            break;
          case 'KeyZ':
            updater.Type.Update(current_page, 'MultiSelect');
            break;
          case 'KeyX':
            updater.Type.Update(current_page, 'Sort');
            break;
          default:
            return;
        }
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', Shortcut);
    return () => window.removeEventListener('keydown', Shortcut);
  }, [current_page]);

  React.useEffect(() => {
    is_first_rendering.current = true;
  }, []);
  React.useEffect(() => {
    if (is_first_rendering.current) {
      is_first_rendering.current = false;
      return;
    }
    document.getElementById(QUESTION_ID)?.focus();
  }, [current_page]);

  // ページ移動
  // 0より小さい値を指定した場合は最初に問題追加+ページを0に
  // 逆も同様
  function MovePageTo(to: number) {
    if (to < 0) {
      AddExam(0);
    } else if (to > exam_length.current - 1) {
      AddExam(-1);
    } else {
      SetCurrentPage(to);
    }
  }

  function AddExam(at: number) {
    const old_exam_len = exam_length.current;
    updater.Exam.Insert(at);
    SetCurrentPage(at === -1 ? old_exam_len : at);
  }

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
              type === 'Text' || type === 'Sort'
                ? updater.Answer.Insert(current_page, index + 1)
                : updater.QuestionChoices.Insert(current_page, index + 1),
          }}
        />
        <Button
          {...{
            text: '最後に追加',
            icon: 'fas fa-arrow-down',
            type: 'material',
            OnClick: () =>
              type === 'Text' || type === 'Sort'
                ? updater.Answer.Insert(current_page, -1)
                : updater.QuestionChoices.Insert(current_page, -1),
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
                  type === 'Text' || type === 'Sort'
                    ? updater.Answer.Remove(current_page, index)
                    : updater.QuestionChoices.Remove(current_page, index),
              }}
            />
          )
        }
      </>
    );
  }

  function AnswerEditArea() {
    let result: React.ReactElement[] | React.ReactElement;
    const type = exam[current_page].type ?? 'Text';
    // Select系はquestion_choicesを使用するので、choicesがなければ初期化
    // (length ?? 0) < 1にすることで、choicesが存在しなかった場合かならず初期化される
    if ((type === 'Select' || type === 'MultiSelect') && (exam[current_page].question_choices?.length ?? 0) < 1) {
      const tmp = exam.concat();
      tmp[current_page].question_choices = [''];
      props.updater(tmp);
    }

    switch (type) {
      case 'Text':
        result = exam[current_page].answer.map((e, i) => {
          return (
            <div key={`examform-text-${i}`}>
              <Form
                label={`答え (${i + 1})`}
                value={e}
                rows={3}
                layer={TabIndexList.Answer}
                OnChange={ev => updater.Answer.Update(current_page, i, ev.target.value)}
              />
              <div className={css.answer_area_buttons}>
                {AddRemoveButtons('Text', i, exam[current_page].answer.length)}
              </div>
            </div>
          );
        });
        break;

      case 'Select':
        result = exam[current_page].question_choices?.map((e, i) => {
          return (
            <div key={`examform-select-${i}`}>
              <div className={css.select_form}>
                <SelectButton
                  type='radio'
                  desc={''}
                  tabIndex={TabIndexList.SelectCorrectAnswer}
                  status={Number(exam[current_page].answer[0]) === i && exam[current_page].answer[0] !== ''}
                  onChange={f => {
                    if (!f) return;
                    if (exam[current_page].answer.length > 1) {
                      const tmp = exam.concat();
                      tmp[current_page].answer = [''];
                      props.updater(tmp);
                    }
                    updater.Answer.Update(current_page, 0, String(i));
                  }}
                />
                <Form
                  value={e}
                  rows={2}
                  layer={TabIndexList.Answer}
                  OnChange={ev => updater.QuestionChoices.Update(current_page, i, ev.target.value)}
                />
              </div>
              <div className={css.answer_area_buttons}>
                {AddRemoveButtons('Select', i, exam[current_page].question_choices?.length ?? 0)}
              </div>
            </div>
          );
        }) ?? <>invalid</>;
        break;

      case 'MultiSelect':
        result = exam[current_page].question_choices?.map((e, i) => {
          return (
            <div key={`examform-multiselect-${i}`}>
              <div className={css.select_form}>
                <SelectButton
                  type='check'
                  desc={''}
                  tabIndex={TabIndexList.SelectCorrectAnswer}
                  status={exam[current_page].answer.indexOf(String(i)) !== -1}
                  onChange={f => {
                    // チェックが付けられた時は追加する
                    if (f) {
                      updater.Answer.Insert(current_page, -1, String(i));
                      // デフォルトで存在する空欄要素を排除
                      const tmp = exam.concat();
                      tmp[current_page].answer = tmp[current_page].answer
                        .filter(e => e !== '')
                        .sort((a, b) => Number(a) - Number(b));
                      props.updater(tmp);
                    } else {
                      // チェックが外された時は該当要素を削除
                      const tmp = exam.concat();
                      tmp[current_page].answer = tmp[current_page].answer
                        .filter(e => e !== String(i) && e !== '')
                        .sort((a, b) => Number(a) - Number(b));
                      props.updater(tmp);
                    }
                  }}
                />
                <Form
                  value={e}
                  rows={2}
                  layer={TabIndexList.Answer}
                  OnChange={ev => updater.QuestionChoices.Update(current_page, i, ev.target.value)}
                />
              </div>
              <div className={css.answer_area_buttons}>
                {AddRemoveButtons('MultiSelect', i, exam[current_page].question_choices?.length ?? 0)}
              </div>
            </div>
          );
        }) ?? <>invalid</>;
        break;

      case 'Sort':
        result = (
          <DragDropContext
            onDragEnd={(e: DropResult) => {
              if (!e.destination) return;
              const tmp = exam.concat();
              tmp[current_page].answer = Move(tmp[current_page].answer, e.source.index, e.destination.index);
              props.updater(tmp);
            }}
          >
            <Droppable droppableId='examform_sort_droppable'>
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {exam[current_page].answer.map((e, i) => {
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
                              OnChange={ev => updater.Answer.Update(current_page, i, ev.target.value)}
                            />
                            <span className={`fas fa-list ${css.icon}`} {...provided.dragHandleProps} />
                            <div className={css.answer_area_buttons}>
                              {AddRemoveButtons('Sort', i, exam[current_page].answer.length)}
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
      OnClick: () => AddExam(0),
    },
    {
      type: 'material',
      icon: 'fas fa-arrow-left',
      text: '1つ前に挿入',
      OnClick: () => AddExam(current_page),
    },
    {
      type: 'material',
      icon: 'fas fa-arrow-right',
      text: '1つ後に挿入',
      OnClick: () => AddExam(current_page + 1),
    },
    {
      type: 'material',
      icon: 'fas fa-angle-double-right',
      text: '最後に挿入',
      OnClick: () => AddExam(-1),
    },
  ];

  if (exam[current_page] === undefined) {
    return <>Loading...</>;
  }

  return (
    <>
      <div className={css.button_list}>
        <div className={css.button_container}>
          <Button type={'material'} icon={'fas fa-angle-double-left'} text={''} OnClick={() => MovePageTo(0)} />
          <Button
            type={'material'}
            icon={'fas fa-chevron-left'}
            text={''}
            OnClick={() => MovePageTo(current_page - 1)}
          />
          <span className={css.current_page}>
            {current_page + 1}/{exam_length.current}
          </span>
          <Button
            type={'material'}
            icon={'fas fa-chevron-right'}
            text={''}
            OnClick={() => MovePageTo(current_page + 1)}
          />
          <Button
            type={'material'}
            icon={'fas fa-angle-double-right'}
            text={''}
            OnClick={() => MovePageTo(exam_length.current - 1)}
          />
        </div>

        <div className={css.button_container}>
          <Button
            type={'material'}
            icon={'fas fa-trash'}
            text={'この問題を削除'}
            OnClick={() => {
              if (current_page === exam_length.current - 1) MovePageTo(current_page - 1);
              updater.Exam.Remove(current_page);
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
            value={exam[current_page].question}
            rows={6}
            layer={TabIndexList.Question}
            OnChange={ev => updater.Question.Update(current_page, ev.target.value)}
          />
          <Form
            label={'コメント（解説など）'}
            value={exam[current_page].comment ?? ''}
            rows={5}
            OnChange={ev => updater.Comment.Update(current_page, ev.target.value)}
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
              status={(exam[current_page].type ?? 'Text') === 'Text'}
              onChange={() => updater.Type.Update(current_page, 'Text')}
            />
            <SelectButton
              type='radio'
              desc='選択問題'
              tabIndex={TabIndexList.TypeSelect}
              status={(exam[current_page].type ?? 'Text') === 'Select'}
              onChange={() => updater.Type.Update(current_page, 'Select')}
            />
            <SelectButton
              type='radio'
              desc='複数選択'
              tabIndex={TabIndexList.TypeSelect}
              status={(exam[current_page].type ?? 'Text') === 'MultiSelect'}
              onChange={() => updater.Type.Update(current_page, 'MultiSelect')}
            />
            <SelectButton
              type='radio'
              desc='並び替え'
              tabIndex={TabIndexList.TypeSelect}
              status={(exam[current_page].type ?? 'Text') === 'Sort'}
              onChange={() => updater.Type.Update(current_page, 'Sort')}
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
              if (!e.destination) return;
              props.updater(Move(exam, e.source.index, e.destination.index));
            }}
          >
            <Droppable droppableId={'question_list'}>
              {provided => (
                <div className={css.question_list} ref={provided.innerRef} {...provided.droppableProps}>
                  {exam.map((e, i) => {
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
                              MovePageTo(i);
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
