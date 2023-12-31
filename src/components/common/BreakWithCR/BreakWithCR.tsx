// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2023 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import React from 'react';

export default function BreakWithCR({str}: {str: string}): React.ReactElement {
  return (
    <>
      {str.split('\n').map(s => (
        <>
          {s}
          <br />
        </>
      ))}
    </>
  );
}
