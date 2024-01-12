// TAGether - Share self-made exam for classmates
// CopyRight (c) 2020-2024 watasuke
//
// Email  : <watasuke102@gmail.com>
// Twitter: @Watasuke102
// This software is released under the MIT or MIT SUSHI-WARE License.
import React from 'react';

// TODO: 以前routeChangeStartに登録していたものはどうなるんでしょうか
export function useConfirmBeforeLeave(): (enable: boolean) => void {
  const enable = React.useRef(false);

  // リロード時に警告（ChromeではreturnValueの中身はユーザーに見えないらしい）
  const BeforeUnLoad = React.useCallback((e: BeforeUnloadEvent): void => {
    if (!enable.current) return;
    e.preventDefault();
    e.returnValue = '変更は破棄されます。ページを移動してもよろしいですか？';
  }, []);

  React.useEffect(() => {
    window.addEventListener('beforeunload', BeforeUnLoad);
    return () => {
      window.removeEventListener('beforeunload', BeforeUnLoad);
    };
  }, []);

  return (e: boolean) => (enable.current = e);
}
