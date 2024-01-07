// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import css from './examtable.module.scss';
import React from 'react';
import Helmet from 'react-helmet';
import {useRouter} from 'next/navigation';
import Button from '@/common/Button/Button';
import {SelectButton} from '@/common/SelectBox';
import {FmtCorrectAnswer} from '@/features/Exam/FmtCorrectAnswer/FmtCorrectAnswer';
import AnswerState from '@mytypes/AnswerState';
import {CategoryDataType} from '@mytypes/Categoly';
import Exam from '@mytypes/Exam';
import ExamHistory from '@mytypes/ExamHistory';
import ArrowLeftIcon from '@assets/arrow-left.svg';
import VisibleIcon from '@assets/visible.svg';
import InvisibleIcon from '@assets/invisible.svg';
import {Shuffle} from '@utils/ArrayUtil';

interface Props {
  data: CategoryDataType;
  history?: ExamHistory;
}

export default function ExamTable(props: Props): React.ReactElement {
  const [show_correct_answer, SetShowCorrectAnswer] = React.useState(false);
  const [filter, SetFilter] = React.useState(0x07);
  const router = useRouter();

  const UpdateFilter = (type: AnswerState, state: boolean) => {
    SetFilter(filter => {
      if (state) {
        return filter | type;
      } else {
        return filter & (~type & 0x07);
      }
    });
  };

  const shuffled_sort_choices: string[] = React.useMemo(
    () =>
      (JSON.parse(props.data.list) as Exam[]).map(exam =>
        exam.type === 'Sort' ? Shuffle(exam.answer).join(' / ') : '',
      ),
    [],
  );

  return (
    <>
      <Helmet title={`問題一覧 : ${props.data.title} - TAGether`} />

      <div className={css.examdata_container}>
        <span className={css.title}>{props.data.title}</span>
        {props.history && (
          <>
            <div className={css.filter_selector}>
              <SelectButton
                type='check'
                desc='全問正解'
                status={(filter & AnswerState.AllCorrect) !== 0}
                onChange={f => UpdateFilter(AnswerState.AllCorrect, f)}
              />
              <SelectButton
                type='check'
                desc='部分正解'
                status={(filter & AnswerState.PartialCorrect) !== 0}
                onChange={f => UpdateFilter(AnswerState.PartialCorrect, f)}
              />
              <SelectButton
                type='check'
                desc='不正解'
                status={(filter & AnswerState.AllWrong) !== 0}
                onChange={f => UpdateFilter(AnswerState.AllWrong, f)}
              />
            </div>
            <span>
              {props.history.total_question}問中{props.history.correct_count}問正解、 正答率
              {props.history && Math.round((props.history.correct_count / props.history.total_question) * 10000) / 100}%
            </span>
          </>
        )}
      </div>

      <table className={css.table}>
        <tbody>
          <tr>
            <th>問題</th>
            <th>正解</th>
            <th>コメント</th>
            {props.history && (
              <>
                <th>自分の解答</th>
                <th className={css.result}>結果</th>
              </>
            )}
          </tr>
          {(JSON.parse(props.data.list) as Exam[])
            .map((exam, i) => (
              <tr key={`tr-${i}`}>
                <td>
                  {exam.question}
                  {(exam.type === 'Select' || exam.type === 'MultiSelect') && (
                    <>
                      <hr />
                      <ul>{exam.question_choices?.map((e, j) => <li key={i + '_choice_' + j}>{e}</li>)}</ul>
                    </>
                  )}
                  {exam.type === 'Sort' && (
                    <>
                      <br />
                      <hr />
                      <span className={css.sort_}>{shuffled_sort_choices[i]}</span>
                    </>
                  )}
                </td>
                {/* 表示した上で透明にすることで、表示・非表示を切り替えたときに高さが変わるのを防ぐ */}
                <td className={show_correct_answer ? '' : css.hide}>
                  <FmtCorrectAnswer exam={exam} />
                </td>
                <td className={show_correct_answer ? '' : css.hide}>{exam.comment ?? ''}</td>
                {props.history && (
                  <>
                    <td>
                      <FmtCorrectAnswer exam={exam} result={props.history.exam_state[i].result} />
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
              </tr>
            ))
            .filter((_, i) => !props.history || (filter & props.history?.exam_state[i].order) !== 0)}
        </tbody>
      </table>

      <div className={css.button_container}>
        <div className={css.buttons}>
          <Button text='戻る' icon={<ArrowLeftIcon />} OnClick={router.back} type='material' />
          {/* 正しい答えの表示/非表示切り替え */}
          <Button
            OnClick={() => SetShowCorrectAnswer(!show_correct_answer)}
            type='material'
            text={show_correct_answer ? '正解を非表示' : '正解を表示'}
            icon={show_correct_answer ? <InvisibleIcon /> : <VisibleIcon />}
          />
        </div>
      </div>
    </>
  );
}
