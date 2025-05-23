// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
'use client';
import React from 'react';
import {ExamPage, ExamPageProps} from './_components/ExamPage/ExamPage';
import {Shuffle} from '@utils/ArrayUtil';
import {redirect} from 'next/navigation';
import {fetch_history} from '@utils/api/history';
import {fetch_category_data, fetch_category_with_spec_tag_data} from '@utils/api/category';
import Loading from './loading';
import {history_title} from '@utils/HistoryTitle';

type Props = {
  searchParams: {
    id?: string;
    history_id?: string;
    tag?: string;
    shuffle?: string;
    choiceShuffle?: string;
    begin?: string;
    end?: string;
  };
};

export default async function Page(props: Props): Promise<JSX.Element> {
  const [exam_props, set_exam_props] = React.useState<ExamPageProps | undefined>();

  React.useEffect(() => {
    (async () => {
      const prop: ExamPageProps = {title: '', exam: []};
      if (props.searchParams.id) {
        const category = await fetch_category_data(props.searchParams.id);
        prop.exam = JSON.parse(category.list);
        prop.title = category.title;
      } else if (props.searchParams.tag) {
        const category = await fetch_category_with_spec_tag_data(props.searchParams.tag);
        prop.exam = JSON.parse(category.list);
        prop.title = category.title;
      } else if (props.searchParams.history_id) {
        const history = await fetch_history(props.searchParams.history_id);
        prop.exam = history.exam.filter(
          (_, i) => history.exam_state[i].correct_count !== history.exam_state[i].total_question,
        );
        prop.title = history_title(history);
        prop.history = history;
      } else {
        redirect('/list');
      }

      const begin = Number(props.searchParams.begin);
      const end = Number(props.searchParams.end);
      prop.exam = prop.exam
        .filter((_, i) => !((begin && i < begin) || (end && i > end)))
        .map(e => {
          if (props.searchParams.choiceShuffle && Array.isArray(e.question_choices)) {
            const choices = Shuffle(e.question_choices.map((e, i) => ({original_index: i, choice: e})));
            e.question_choices = choices.map(choice => choice.choice);
            if (e.type === 'Select' || e.type === 'MultiSelect') {
              e.answer = choices.flatMap((choice, i) =>
                e.answer.indexOf(String(choice.original_index)) !== -1 ? String(i) : [],
              );
            }
          }
          return e;
        });
      if (props.searchParams.shuffle) {
        prop.exam = Shuffle(prop.exam);
      }
      set_exam_props(prop);
    })();
  }, []);

  return exam_props ? <ExamPage {...exam_props} /> : <Loading />;
}
