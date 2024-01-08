// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
export function is_mobile_device(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  return navigator.userAgent.match(/iPhone|Android.*Mobile/) !== null;
}
