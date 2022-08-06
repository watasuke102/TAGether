// TAGether - Share self-made exam for classmates
// BreakWithCR.tsx
//
// CopyRight (c) 2020-2022 Watasuke
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT SUSHI-WARE License.
//
import React from 'react';

export default function BreakWithCR({str}: {str: string}): React.ReactElement {
  return (
    <>
      {str.split('\n').map(s => (
        <>
          {s}
          <br />
        </>
      ))}{' '}
    </>
  );
}
