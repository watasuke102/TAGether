// TAGether - Share self-made data for classmates
// ForceRender.ts
//
// CopyRight (c) 2020-2021 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react';

export function useForceRender(): () => void {
  const [, bool] = React.useState(false);
  return () => bool(f => !f);
}
