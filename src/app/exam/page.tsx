// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import React from 'react';
import Exam from '@mytypes/Exam';
import {fetcher} from '@utils/api/common';
import {ExamPage} from './_components/ExamPage/ExamPage';
import {Shuffle} from '@utils/ArrayUtil';

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

export default async function Exam(props: Props): Promise<JSX.Element> {
  let category;
  if (props.searchParams.id) {
    category = await fetcher(`http://localhost:3009/api/category/${props.searchParams.id}`);
  } else if (props.searchParams.tag) {
    category = await fetcher(`http://localhost:3009//${tag_id}/all_category`);
  }

  const begin = Number(props.searchParams.begin);
  const end = Number(props.searchParams.end);
  let exam = (JSON.parse(category[0].list) as Exam[])
    .filter((_, i) => !((begin && i < begin) || (end && i > end)))
    .map(e => {
      if (props.searchParams.choiceShuffle && Array.isArray(e.question_choices)) {
        e.question_choices = Shuffle(e.question_choices);
      }
      return e;
    });
  if (props.searchParams.shuffle) {
    exam = Shuffle(exam);
  }

  return <ExamPage exam={exam} title={category[0].title} />;
}
