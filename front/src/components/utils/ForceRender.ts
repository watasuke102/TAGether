// TAGether - Share self-made data for classmates
// ForceRender.ts
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
//
import React from 'react';

export function useForceRender(): () => void {
  const [, bool] = React.useState(false);
  return () => bool(f => !f);
}
