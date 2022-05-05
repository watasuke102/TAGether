// TAGether - Share self-made data for classmates
// DefaultValue.ts
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import Categoly from '@mytypes/Categoly';
import Exam from '@mytypes/Exam';
import FeatureRequest from '@mytypes/FeatureRequest';
import TagData from '@mytypes/TagData';

export function categoly_default(): Categoly {
  return {
    id: 0,
    updated_at: '',
    version: 2,
    title: '',
    description: '',
    tag: [],
    list: JSON.stringify(exam_default(), undefined, '  '),
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
  return [{question: '', answer: [''], comment: ''}];
}
