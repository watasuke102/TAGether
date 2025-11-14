// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2025 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @watasuke1024
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './Table.module.scss';
import ArrowLeftIcon from '@assets/arrow-left.svg';
import VisibleIcon from '@assets/visible.svg';
import InvisibleIcon from '@assets/invisible.svg';
import ArrowRightIcon from '@assets/arrow-right.svg';
import React from 'react';
import {useRouter} from 'next/navigation';
import Button from '@/common/Button/Button';
import {SelectButton} from '@/common/SelectBox';
import {FmtCorrectAnswer} from '@/features/Exam/FmtCorrectAnswer/FmtCorrectAnswer';
import {FmtUserAnswer} from '@/features/Exam/FmtUserAnswer/FmtUserAnswer';
import AnswerState from '@mytypes/AnswerState';
import Exam from '@mytypes/Exam';
import {History} from '@mytypes/ExamHistory';
import {Shuffle} from '@utils/ArrayUtil';

export type ExamTableProps = {
  title: string;
  exam: Exam[];
  id?: string;
  history?: History;
};

export function Table(props: ExamTableProps): React.ReactElement {
  const [show_correct_answer, SetShowCorrectAnswer] = React.useState(false);
  const [show_user_answer, set_show_user_answer] = React.useState(false);
  const [filter, SetFilter] = React.useState(0x07);
  const router = useRouter();

  const [correct_answers, total_questions] = props.history?.exam_state.reduce(
    (acc, cur) => [acc[0] + cur.correct_count, acc[1] + cur.total_question],
    [0, 0],
  ) ?? [undefined, undefined];

  const choices: string[][] = React.useMemo(
    () =>
      props.exam.map(exam => {
        switch (exam.type) {
          case 'Select':
          case 'MultiSelect':
          case 'ListSelect':
            return exam.question_choices ?? [];
          case 'Sort':
            return Shuffle(exam.answer);
          default:
            return [];
        }
      }),
    [props.exam],
  );
  const answer_state = React.useMemo(
    () =>
      props.history?.exam_state.map(e => {
        if (e.correct_count === e.total_question) {
          return AnswerState.AllCorrect;
        } else if (e.correct_count === 0) {
          return AnswerState.AllWrong;
        }
        return AnswerState.PartialCorrect;
      }),
    [props.history?.exam_state],
  );

  return (
    <>
      <div className={css.examdata_container}>
        <span className={css.title}>{props.title}</span>
        {props.history && (
          <>
            <div className={css.filter_selector}>
              <SelectButton
                type='check'
                desc='全問正解'
                status={(filter & AnswerState.AllCorrect) !== 0}
                onChange={() => SetFilter(f => f ^ AnswerState.AllCorrect)}
              />
              <SelectButton
                type='check'
                desc='部分正解'
                status={(filter & AnswerState.PartialCorrect) !== 0}
                onChange={() => SetFilter(f => f ^ AnswerState.PartialCorrect)}
              />
              <SelectButton
                type='check'
                desc='不正解'
                status={(filter & AnswerState.AllWrong) !== 0}
                onChange={() => SetFilter(f => f ^ AnswerState.AllWrong)}
              />
            </div>
            {total_questions !== undefined && correct_answers !== undefined && (
              <span>
                {total_questions}問中{correct_answers}問正解、 正答率
                {props.history && Math.round((correct_answers / total_questions) * 10000) / 100}%
              </span>
            )}
          </>
        )}
      </div>

      <table className={css.table}>
        <tbody>
          <tr>
            <th>問題</th>
            <th>正解</th>
            {props.history && (
              <>
                <th>自分の解答</th>
                <th className={css.result}>結果</th>
              </>
            )}
            <th>コメント</th>
          </tr>
          {props.exam
            .map((exam, i) => (
              <tr key={`tr-${i}`}>
                <td>
                  {exam.question}
                  {choices[i].length !== 0 && (
                    <>
                      <br />
                      <hr />
                      <span className={css.choices_header}>[選択肢]</span>
                      <ul>
                        {choices[i].map((e, j) => (
                          <li key={`choice${i}${j}`}>{e}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </td>
                {/* 表示した上で透明にすることで、表示・非表示を切り替えたときに高さが変わるのを防ぐ */}
                <td className={show_correct_answer ? '' : css.hide}>
                  <FmtCorrectAnswer exam={exam} />
                </td>
                {props.history && (
                  <>
                    <td className={show_user_answer ? '' : css.hide}>
                      <FmtUserAnswer
                        exam={exam}
                        user_answer={props.history.exam_state[i].user_answer}
                        result={props.history.exam_state[i].result}
                      />
                    </td>
                    <td>
                      {(() => {
                        const stat = props.history.exam_state[i];
                        if (stat.correct_count === stat.total_question) {
                          return '正解';
                        }
                        if (stat.correct_count === 0) {
                          return '不正解';
                        }
                        return `${stat.correct_count}問正解`;
                      })()}
                    </td>
                  </>
                )}
                <td className={show_correct_answer ? '' : css.hide}>{exam.comment ?? ''}</td>
              </tr>
            ))
            .filter((_, i) => !props.history || (filter & (answer_state?.at(i) ?? 0xff)) !== 0)}
        </tbody>
      </table>

      <div className={css.button_container}>
        <div className={css.buttons}>
          <Button text='戻る' icon={<ArrowLeftIcon />} OnClick={router.back} variant='material' />
          {props.history && (
            <Button
              OnClick={() => set_show_user_answer(e => !e)}
              variant='material'
              text={show_user_answer ? '自分の解答を非表示' : '自分の解答を表示'}
              icon={show_user_answer ? <InvisibleIcon /> : <VisibleIcon />}
            />
          )}
          <Button
            OnClick={() => SetShowCorrectAnswer(!show_correct_answer)}
            variant='material'
            text={show_correct_answer ? '正解を非表示' : '正解を表示'}
            icon={show_correct_answer ? <InvisibleIcon /> : <VisibleIcon />}
          />
          <Button
            OnClick={() =>
              router.push(props.history ? `/exam?history_id=${props.history.id}` : `/exam?id=${props.id ?? ''}`)
            }
            variant='filled'
            text={'この問題を解く'}
            icon={<ArrowRightIcon />}
          />
        </div>
      </div>
    </>
  );
}
