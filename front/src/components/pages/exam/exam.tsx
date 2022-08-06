// TAGether - Share self-made exam for classmates
// exam.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './exam.module.scss';
import {format} from 'date-fns';
import Router from 'next/router';
import React from 'react';
import Helmet from 'react-helmet';
import BreakWithCR from '@/common/BreakWithCR/BreakWithCR';
import Button from '@/common/Button/Button';
import ButtonContainer from '@/common/Button/ButtonContainer';
import Loading from '@/common/Loading/Loading';
import Modal from '@/common/Modal/Modal';
import {FORM_ID, AnswerArea} from '@/features/Exam/AnswerArea';
import {ParseAnswer} from '@/features/ParseAnswer';
import {Shuffle} from '@/utils/ArrayUtil';
import {useConfirmBeforeLeave} from '@/utils/ConfirmBeforeLeave';
import {AddExamHistory} from '@/utils/ManageDB';
import AnswerState from '@mytypes/AnswerState';
import ButtonInfo from '@mytypes/ButtonInfo';
import Categoly from '@mytypes/Categoly';
import Exam from '@mytypes/Exam';
import ExamHistory from '@mytypes/ExamHistory';
import ExamState from '@mytypes/ExamState';

enum NextButtonState {
  show_answer,
  next_question,
  finish_exam,
}

interface Props {
  data: Categoly;
  history_id: string | string[] | undefined;
  tag_filter: string | string[] | undefined;
  history?: ExamHistory;
}

export default function ExamPageComponent(props: Props): JSX.Element {
  // 警告を無効化することはないのでは？
  // 解答中はもちろん、解き終わったあとも結果を見ようとするかもしれない
  useConfirmBeforeLeave()(true);

  const exam: Exam[] = JSON.parse(props.data.list);
  const [is_modal_open, SetIsModalOpen] = React.useState(false);

  const [next_button_state, SetNextButtonState] = React.useState(NextButtonState.show_answer);
  const next_button_state_ref = React.useRef(NextButtonState.show_answer);
  next_button_state_ref.current = next_button_state;

  const [index, SetIndex] = React.useState(0);
  const index_ref = React.useRef(0);
  index_ref.current = index;

  const [history_id, SetHistoryId] = React.useState(0);

  const [correct_answers, SetCorrectAnswers] = React.useState(0);
  const correct_answers_ref = React.useRef(0);
  correct_answers_ref.current = correct_answers;

  const [total_questions, SetTotalQuestions] = React.useState(0);
  const total_questions_ref = React.useRef(0);
  total_questions_ref.current = total_questions;

  const [exam_state, SetExamState] = React.useState(
    (() => {
      const exam_state: ExamState[] = Array<ExamState>(exam.length);
      for (let i = 0; i < exam.length; i++) {
        let ans = Array<string>(exam[i].answer.length).fill('');
        if (i === 0 && exam[0].type === 'Sort' && props.data.version === 2) {
          ans = Shuffle(exam[0].answer);
        }
        exam_state[i] = {
          order: AnswerState.AllCorrect,
          checked: false,
          total_question: exam[i].answer.length,
          correct_count: 0,
          user_answer: ans,
        };
      }
      return exam_state;
    })(),
  );
  const exam_state_ref = React.useRef<ExamState[]>([]);
  exam_state_ref.current = exam_state;

  // ショートカットキー
  const Shortcut = React.useCallback((e: KeyboardEvent) => {
    // Ctrl+Shift+矢印キー等で動かす
    // キーリピートでの入力とウィンドウが表示されている場合は無効
    if (e.ctrlKey && e.shiftKey && !e.repeat && !is_modal_open) {
      switch (e.code) {
        case 'KeyH':
        case 'ArrowLeft':
          e.preventDefault();
          DecrementIndex();
          break;
        case 'KeyL':
        case 'ArrowRight':
          e.preventDefault();
          IncrementIndex();
          break;
      }
    }
  }, []);
  React.useEffect(() => {
    window.addEventListener('keydown', e => Shortcut(e));
    return () => {
      window.removeEventListener('keydown', e => Shortcut(e));
    };
  }, []);

  // ページ移動時、フォーカスする
  React.useEffect(() => {
    // どれか一つでも解答が入力されていたら終わり
    // Sortはanswerが埋まってるはずなのでスキップ
    if (exam[index].type !== 'Sort') {
      for (let i = 0; i < exam_state[index].user_answer.length; i++) {
        if (exam_state[index].user_answer[i] !== '') return;
      }
    }

    switch (exam[index].type) {
      case 'Text':
        document.getElementById(FORM_ID)?.focus();
        break;
      case 'Select':
      case 'MultiSelect':
        document.getElementById('select-first')?.focus();
        break;
      case 'Sort':
        document.getElementById('sort-first-draghandle')?.focus();
        break;
    }
  }, [index]);

  // 解答が合っているかどうか確認してstateに格納
  // 最後の問題の答え合わせであれば、履歴を保存する
  function CheckAnswer(): void {
    let all_correct = true;
    const result: ExamState = exam_state_ref.current[index_ref.current];
    result.checked = true;

    // 複数選択問題は、完全一致のみ正解にする
    if (exam[index_ref.current].type === 'MultiSelect' && props.data.version === 2) {
      // 空欄削除+ソート+文字列化した後、比較する
      const ans = exam_state_ref.current.concat();
      ans[index_ref.current].user_answer = ans[index_ref.current].user_answer.filter(e => e !== '').sort();
      SetExamState(ans);
      const my_answers = ans[index_ref.current].user_answer.toString();
      const real_answers = exam[index_ref.current].answer.sort().toString();
      if (my_answers === real_answers) {
        result.correct_count++;
        SetCorrectAnswers(n => n + 1);
      } else {
        all_correct = false;
      }
      SetTotalQuestions(n => n + 1);
      // 空欄削除+ソートされたものに変えておく
    } else {
      let correct: boolean = false;
      exam[index_ref.current].answer.forEach((e, i) => {
        correct = false;
        // '&'で区切る（AもしくはBみたいな数種類の正解を用意できる）
        e.split('&').forEach(ans => {
          if (exam_state_ref.current[index_ref.current].user_answer[i] === ans && !correct) {
            // 合ってたら正解数と全体の正解数をインクリメント
            correct = true;
            result.correct_count++;
            SetCorrectAnswers(n => n + 1);
          }
        });
        if (!correct) all_correct = false;
        SetTotalQuestions(n => n + 1);
      });
    }

    // 全問正解
    if (all_correct) {
      result.order = AnswerState.AllCorrect;
    } else {
      // 全問不正解の場合
      if (result.correct_count === 0) {
        result.order = AnswerState.AllWrong;
      } else {
        // 部分正解
        result.order = AnswerState.PartialCorrect;
      }
    }
    SetExamState(state => {
      state[index_ref.current] = result;
      return state;
    });

    // 最後の問題を答え合わせしたとき、履歴を保存する
    if (index_ref.current === exam.length - 1) {
      const exam_history: ExamHistory = {
        times: props.history ? props.history.times + 1 : 0,
        original_title: props.history ? props.history.original_title : props.data.title,
        categoly: {
          ...props.data,
          id: -1,
          title: props.history
            ? `${props.history.original_title} (解き直し：${props.history.times + 1}回目)`
            : props.data.title,
          updated_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        },
        correct_count: correct_answers_ref.current,
        total_question: total_questions_ref.current,
        exam_state: exam_state_ref.current,
      };
      AddExamHistory(exam_history).then(i => SetHistoryId(i));
    }
  }

  // indexを増減する
  function ChangeIndex(i: number): void {
    let button_state = NextButtonState.show_answer;
    // 解答済みの問題だった場合
    if (exam_state[i].checked) {
      // 最後の問題であれば終了ボタン
      if (i === exam.length - 1) {
        button_state = NextButtonState.finish_exam;
      } else {
        //そうでないなら次へボタン
        button_state = NextButtonState.next_question;
      }
    }
    SetIndex(i);
    SetNextButtonState(button_state);
  }
  function IncrementIndex(): void {
    switch (next_button_state_ref.current) {
      // 答えを表示、答え合わせをする
      case NextButtonState.show_answer:
        CheckAnswer();
        if (index_ref.current === exam.length - 1) {
          // 終了ボタン
          SetNextButtonState(NextButtonState.finish_exam);
        } else {
          //そうでないなら次へボタン
          SetNextButtonState(NextButtonState.next_question);
        }
        break;

      // 次の問題へ進む
      case NextButtonState.next_question:
        const next_index = index_ref.current + 1;
        // indexの変更
        ChangeIndex(next_index);

        // 次が並び替え問題なら、exam.answerをstate.answersにコピーしてシャッフル
        if (exam[next_index].type === 'Sort' && props.data.version === 2) {
          // 引数なしconcatで深いコピー
          const tmp = exam_state.concat();
          tmp[next_index].user_answer = Shuffle(exam[next_index].answer);
          SetExamState(tmp);
        }
        break;

      // 終了ボタンを押したらモーダルウィンドウを表示
      case NextButtonState.finish_exam:
        SetIsModalOpen(true);
        break;
    }
  }
  function DecrementIndex(): void {
    if (index_ref.current === 0) return;
    // indexの変更
    ChangeIndex(index_ref.current - 1);
  }

  function NextButton(): React.ReactElement {
    const info: ButtonInfo = {
      icon: '',
      text: '',
      type: 'material',
      OnClick: () => IncrementIndex(),
    };
    switch (next_button_state) {
      case NextButtonState.show_answer:
        info.text = '答え合わせ';
        info.icon = 'far fa-circle';
        break;
      case NextButtonState.next_question:
        info.text = '次へ';
        info.icon = 'fas fa-arrow-right';
        break;
      case NextButtonState.finish_exam:
        info.text = '終了';
        info.icon = 'fas fa-check';
        info.type = 'filled';
        break;
    }
    return <Button {...info} />;
  }

  // 正解状況の表示
  function ShowExamState(): React.ReactElement | undefined {
    const state: ExamState = exam_state_ref.current[index_ref.current];
    if (!state.checked) return;

    const answer_length = exam[index_ref.current].answer.length;
    let icon = 'fas fa-times';
    let result: string;
    // 問題数がひとつだった場合は「正解 or 不正解」
    if (answer_length === 1 || (exam[index_ref.current].type === 'MultiSelect' && props.data.version === 2)) {
      // 正解だった場合
      if (state.correct_count === 1) {
        icon = 'far fa-circle';
        result = '正解';
      } else {
        // 不正解だった場合
        result = '不正解';
      }
    } else {
      // 問題が2つ以上だった場合は「n問正解」
      // 全問正解で○アイコン
      if (state.correct_count === answer_length) {
        icon = 'far fa-circle';
      }
      result = state.correct_count + '問正解';
    }
    return (
      <div className={css.state_and_answer}>
        <div className={css.exam_state}>
          <div className={icon} />
          <p>{result}</p>
        </div>
        <div className={css.answer_list}>
          <p id={css.seikai}>正解:</p>
          {ParseAnswer(
            exam[index_ref.current].answer,
            exam[index_ref.current],
            exam_state_ref.current[index_ref.current].user_answer,
          )}
          {exam[index_ref.current].comment && (
            <div>
              <h2>コメント</h2>
              <p>
                <BreakWithCR str={exam[index_ref.current].comment ?? ''} />
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  function CorrectRate(): number {
    return Math.round((correct_answers / total_questions) * 10000) / 100;
  }

  // 読み込みが終わっていなかった場合
  if (exam.length === 0 && props.history) {
    return <Loading />;
  }

  const current_status = `${index + 1} / ${exam.length}`;
  return (
    <>
      <Helmet title={`(${current_status}) : ${props.data.title} - TAGether`} />

      <h1>{current_status}</h1>

      <div className={css.display}>
        {/* 問題文、解答欄 */}
        <div className={css.exam}>
          <div className={css.question_area}>
            <div>
              <span id={css.mondai}>問題</span>
            </div>
            <div className={css.question_text}>
              <p>
                {exam[index].question.split('\n').map(str => {
                  return (
                    <>
                      {' '}
                      {str}
                      <br />{' '}
                    </>
                  );
                })}
              </p>
            </div>
          </div>

          <form>
            <AnswerArea
              version={props.data.version}
              index={index_ref.current}
              exam={exam[index_ref.current]}
              answers={exam_state[index_ref.current].user_answer}
              setAnswers={list => {
                const tmp = exam_state.concat();
                tmp[index_ref.current].user_answer = list;
                SetExamState(tmp);
              }}
              disable={exam_state[index_ref.current].checked}
              shortcutDisable={is_modal_open}
            />
            {/* 入力中エンターを押して送信を無効化 */}
            <input id={css.dummy} />
          </form>
        </div>

        {/* 結果 */}
        {ShowExamState()}
      </div>

      <div className={css.button_container}>
        <div className={css.buttons}>
          {index === 0 ? (
            // 次へボタンを右に寄せたいのでdiv
            <div></div>
          ) : (
            <Button text='戻る' icon='fas fa-arrow-left' OnClick={() => DecrementIndex()} type='material' />
          )}
          {NextButton()}
        </div>
      </div>

      <Modal isOpen={is_modal_open} close={() => SetIsModalOpen(false)}>
        <div className={css.modal}>
          <span className={css.head}>🎉問題終了🎉</span>
          <p>お疲れさまでした。</p>
          <p className={css.correct_rate}>
            <b>正答率{CorrectRate()}%</b>
            <br />（{total_questions}問中{correct_answers}問正解）
          </p>
          <ButtonContainer>
            {!props.history && !props.tag_filter && props.data.id !== undefined ? (
              <Button
                text={'編集する'}
                icon={'fas fa-pen'}
                type={'material'}
                OnClick={() => Router.push('/edit?id=' + props.data.id)}
              />
            ) : (
              <></>
            )}
            <Button
              text={'回答状況一覧'}
              icon={'fas fa-list'}
              type={'material'}
              OnClick={() => {
                Router.push(`/examtable?history_id=${history_id}`);
              }}
            />
            <Button text={'前のページへ'} icon={'fas fa-arrow-left'} type={'filled'} OnClick={Router.back} />
          </ButtonContainer>
        </div>
      </Modal>
    </>
  );
}
