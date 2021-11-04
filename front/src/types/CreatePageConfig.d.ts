// TAGether - Share self-made exam for classmates
// CreatePageConfig.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import ButtonInfo from './ButtonInfo';

interface CreatePageConfig {
  document_title: string
  heading: string
  api_method: string
  api_success: string
  buttons: ButtonInfo[]
}

export default CreatePageConfig;
