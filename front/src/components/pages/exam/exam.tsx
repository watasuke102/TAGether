// TAGether - Share self-made exam for classmates
// exam.tsx
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import css from './exam.module.scss';
import {format} from 'date-fns';
import Router from 'next/router';
import React from 'react';
import Helmet from 'react-helmet';
import Button from '@/common/Button/Button';
import ButtonContainer from '@/common/Button/ButtonContainer';
import Modal from '@/common/Modal/Modal';
import AnswerArea from '@/features/Exam/AnswerArea';
import ExamTable from '@/features/ExamTable/ExamTableComponent';
import {ParseAnswer} from '@/features/ParseAnswer';
import {Shuffle} from '@/utils/ArrayUtil';
import {useConfirmBeforeLeave} from '@/utils/ConfirmBeforeLeave';
import {AddExamHistory} from '@/utils/ManageDB';
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
}

export default function ExamPageComponent(props: Props): JSX.Element {
  // 警告を無効化することはないのでは？
  // 解答中はもちろん、解き終わったあとも結果を見ようとするかもしれない
  useConfirmBeforeLeave()(true);

  const exam: Exam[] = JSON.parse(props.data.list);
  const textarea_ref = React.useRef<HTMLTextAreaElement>(null);
  const [index, SetIndex] = React.useState(0);
  const [showExamStateTable, SetShowExamStateTable] = React.useState(false);
  const [showCorrectAnswer, SetshowCorrectAnswer] = React.useState(false);
  const [isModalOpen, SetIsModalOpen] = React.useState(false);
  const [nextButtonState, SetNextButtonState] = React.useState(NextButtonState.show_answer);

  const [answers, SetAnswers] = React.useState<string[][]>(
    (() => {
      const answers: string[][] = Array<Array<string>>(exam.length);
      for (let i = 0; i < exam.length; i++) {
        answers[i] = Array<string>(exam[i].answer.length).fill('');
      }
      return answers;
    })(),
  );

  const [examState, SetExamState] = React.useState(
    (() => {
      const exam_state: ExamState[] = Array<ExamState>(exam.length);
      for (let i = 0; i < exam.length; i++) {
        exam_state[i] = {order: 0, checked: false, correctAnswerCount: 0};
      }
      return exam_state;
    })(),
  );

  let total_questions = 0;
  let correct_answers = 0;
  let correct_rate = 0;

  // 最初が並び替えならコピー+シャッフル
  if (exam[0].type === 'Sort' && props.data.version === 2) {
    answers[0] = Shuffle(exam[0].answer);
  }

  const exam_history: ExamHistory = {
    id: props.data.id ?? 0,
    title: props.data.title,
    date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    correct_count: 0,
    total_question: 0,
    wrong_exam: [],
  };
  // stateの初期化

  // ショートカットキー
  const Shortcut = React.useCallback((e: KeyboardEvent) => {
    // Ctrl+Shift+矢印キー等で動かす
    // キーリピートでの入力とウィンドウが表示されている場合は無効
    if (e.ctrlKey && e.shiftKey && !e.repeat && !isModalOpen) {
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

      // 間違えた問題のやり直しでない and タグ全部でもない and 最後まで解いた
      // この条件を満たしているとき結果を保存する
      if (props.history_id === undefined && props.tag_filter === undefined && examState.slice(-1)[0].checked) {
        exam_history.total_question = total_questions;
        exam_history.correct_count = correct_answers;
        AddExamHistory(exam_history);
      }
    };
  }, []);

  React.useEffect(() => {
    // どれか一つでも解答が入力されていたら終わり
    // Sortはanswerが埋まってるはずなのでスキップ
    if (exam[index].type !== 'Sort') {
      for (let i = 0; i < answers[index].length; i++) if (answers[index][i] !== '') return;
    }

    switch (exam[index].type) {
      case 'Text':
        textarea_ref.current?.focus();
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
  function CheckAnswer(): void {
    const result: ExamState = {order: 0, checked: true, correctAnswerCount: 0};
    let all_correct = true;

    // 複数選択問題は、完全一致のみ正解にする
    if (exam[index].type === 'MultiSelect' && props.data.version === 2) {
      // 空欄削除+ソート+文字列化した後、比較する
      const tmp = answers.concat();
      tmp[index] = tmp[index].filter(e => e !== '').sort();
      SetAnswers(tmp);
      const my_answers = tmp[index].toString();
      const real_answers = exam[index].answer.sort().toString();
      if (my_answers === real_answers) {
        result.correctAnswerCount++;
        correct_answers++;
      } else {
        all_correct = false;
      }
      total_questions++;
      // 空欄削除+ソートされたものに変えておく
    } else {
      let correct: boolean = false;
      exam[index].answer.forEach((e, i) => {
        correct = false;
        // '&'で区切る（AもしくはBみたいな数種類の正解を用意できる）
        e.split('&').forEach(ans => {
          if (answers[index][i] === ans && !correct) {
            // 合ってたら正解数と全体の正解数をインクリメント
            correct = true;
            result.correctAnswerCount++;
            correct_answers++;
          }
        });
        if (!correct) all_correct = false;
        total_questions++;
      });
    }

    // 全問正解
    if (all_correct) {
      result.order = 0;
    } else {
      // 1問でも間違っていたら、間違えた問題リストに追加
      exam_history.wrong_exam.push(exam[index]);
      // 全問不正解の場合
      if (result.correctAnswerCount === 0) {
        result.order = 2;
      } else {
        // 部分正解
        result.order = 1;
      }
    }
    const tmp = examState;
    tmp[index] = result;
    SetExamState(tmp);
  }

  // indexを増減する
  function ChangeIndex(i: number): void {
    let button_state = NextButtonState.show_answer;
    // 解答済みの問題だった場合
    if (examState[i].checked) {
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
    switch (nextButtonState) {
      // 答えを表示、答え合わせをする
      case NextButtonState.show_answer:
        CheckAnswer();
        // 最後の問題であれば、ボタンを終了ボタンに
        if (index === exam.length - 1) {
          SetNextButtonState(NextButtonState.finish_exam);
        } else {
          //そうでないなら次へボタン
          SetNextButtonState(NextButtonState.next_question);
        }
        break;

      // 次の問題へ進む
      case NextButtonState.next_question:
        const next_index = index + 1;
        // indexの変更
        ChangeIndex(next_index);

        // 次が並び替え問題なら、exam.answerをstate.answersにコピーしてシャッフル
        if (exam[next_index].type === 'Sort' && props.data.version === 2) {
          // 引数なしconcatで深いコピー
          const tmp = answers.concat();
          tmp[next_index] = Shuffle(exam[next_index].answer);
          SetAnswers(tmp);
        }
        break;

      // 終了ボタンを押したらモーダルウィンドウを表示
      case NextButtonState.finish_exam:
        SetIsModalOpen(true);
        correct_rate = Math.round((correct_answers / total_questions) * 10000) / 100;
        break;
    }
  }
  function DecrementIndex(): void {
    if (index === 0) return;
    // indexの変更
    ChangeIndex(index - 1);
  }

  function NextButton(): React.ReactElement {
    const info: ButtonInfo = {
      icon: '',
      text: '',
      type: 'material',
      onClick: () => IncrementIndex(),
    };
    switch (nextButtonState) {
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
    const state: ExamState = examState[index];
    if (!state.checked) return;

    const answer_length = exam[index].answer.length;
    let icon = 'fas fa-times';
    let result: string;
    // 問題数がひとつだった場合は「正解 or 不正解」
    if (answer_length === 1 || (exam[index].type === 'MultiSelect' && props.data.version === 2)) {
      // 正解だった場合
      if (state.correctAnswerCount === 1) {
        icon = 'far fa-circle';
        result = '正解';
      } else {
        // 不正解だった場合
        result = '不正解';
      }
    } else {
      // 問題が2つ以上だった場合は「n問正解」
      // 全問正解で○アイコン
      if (state.correctAnswerCount === answer_length) {
        icon = 'far fa-circle';
      }
      result = state.correctAnswerCount + '問正解';
    }
    return (
      <div className={css.state_and_answer}>
        <div className={css.exam_state}>
          <div className={icon} />
          <p>{result}</p>
        </div>
        <div className={css.answer_list}>
          <p id={css.seikai}>正解:</p>
          {ParseAnswer(exam[index].answer, exam[index], answers[index])}
          {exam[index].comment && (
            <div>
              <h2>コメント</h2>
              <p>
                {exam[index].comment?.split('\n').map(s => (
                  <>
                    {s}
                    <br />
                  </>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 解答状況一覧を表示する
  if (showExamStateTable) {
    const list: React.ReactElement[] = [];
    let users_answer: string = '';
    exam.forEach(e => {
      users_answer = '';
      e.answer.forEach(e => (users_answer += e + ', '));
      list.push(
        <tr>
          <td>
            {e.question.split('\n').map(str => {
              return (
                <>
                  {' '}
                  {str}
                  <br />{' '}
                </>
              );
            })}
          </td>
          <td>{users_answer.slice(0, -2)}</td>
          <td></td>
        </tr>,
      );
    });

    return (
      <>
        <div className={css.examdata_container}>
          <h2>{props.data.title}</h2>
          <div className={css.correct_rate_statuslist}>
            <p>
              {total_questions}問中{correct_answers}問正解、 正答率{correct_rate}%
            </p>
          </div>
        </div>

        <ExamTable exam={exam} answers={answers} examState={examState} showCorrectAnswer={showCorrectAnswer} />
        <div className={css.button_container}>
          <div className={css.buttons}>
            <Button
              {...{
                text: 'もう一度',
                icon: 'fas fa-undo',
                onClick: Router.reload,
                type: 'material',
              }}
            />
            {/* 正しい答えの表示/非表示切り替え */}
            <Button
              {...{
                onClick: () => SetshowCorrectAnswer(f => !f),
                type: 'material',
                text: showCorrectAnswer ? '正解を非表示' : '正解を表示',
                icon: showCorrectAnswer ? 'fas fa-eye-slash' : 'fas fa-eye',
              }}
            />
            <Button
              {...{
                text: '前のページへ',
                icon: 'fas fa-arrow-left',
                onClick: Router.back,
                type: 'filled',
              }}
            />
          </div>
        </div>
      </>
    );
  }

  // 読み込みが終わっていなかった場合
  if (exam.length === 0 && props.history_id) {
    return <p>読み込み中...</p>;
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
              <h2 id={css.mondai}>問題</h2>
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
              exam={exam[index]}
              answers={answers[index]}
              setAnswers={list => {
                const tmp = answers.concat();
                tmp[index] = list;
                SetAnswers(tmp);
              }}
              disable={examState[index].checked}
              shortcutDisable={isModalOpen}
              ref={textarea_ref}
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
            <Button text='戻る' icon='fas fa-arrow-left' onClick={() => DecrementIndex()} type='material' />
          )}
          {NextButton()}
        </div>
      </div>

      <Modal isOpen={isModalOpen} close={() => SetIsModalOpen(false)}>
        <div className={css.window}>
          <h1>🎉問題終了🎉</h1>
          <p>お疲れさまでした。</p>
          <p className={css.correct_rate}>
            <b>正答率{correct_rate}%</b>
            <br />（{total_questions}問中{correct_answers}問正解）
          </p>
          <ButtonContainer>
            {!props.history_id && !props.tag_filter && props.data.id !== undefined ? (
              <Button
                {...{
                  text: '編集する',
                  icon: 'fas fa-pen',
                  type: 'material',
                  onClick: () => Router.push('/edit?id=' + props.data.id),
                }}
              />
            ) : (
              <></>
            )}
            <Button
              {...{
                text: '回答状況一覧',
                icon: 'fas fa-list',
                type: 'material',
                onClick: () => {
                  SetIsModalOpen(false);
                  SetShowExamStateTable(true);
                },
              }}
            />
            <Button
              {...{
                text: '前のページへ',
                icon: 'fas fa-arrow-left',
                type: 'filled',
                onClick: Router.back,
              }}
            />
          </ButtonContainer>
        </div>
      </Modal>
    </>
  );
}
