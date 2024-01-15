// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import {CategoryDataType} from '@mytypes/Category';
import Exam from '@mytypes/Exam';
import FeatureRequest from '@mytypes/FeatureRequest';
import TagData from '@mytypes/TagData';

export function category_default(): CategoryDataType {
  return {
    id: 0,
    updated_at: '',
    version: 2,
    title: '',
    description: '',
    tag: [],
    list: JSON.stringify(exam_default(), undefined, '  '),
    deleted: false,
  };
}

export function request_default(): FeatureRequest {
  return {
    id: 0,
    body: '',
    answer: '',
    updated_at: '',
  };
}

export function tagdata_default(): TagData {
  return {
    name: '',
    updated_at: '',
    description: '',
  };
}

export function exam_default(): Exam[] {
  return [{question: '', question_choices: [''], answer: [''], comment: ''}];
}
