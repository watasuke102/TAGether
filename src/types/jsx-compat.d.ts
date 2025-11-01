import type React from 'react';

declare global {
  namespace JSX {
    // Bridge for projects using `JSX.Element` with React 19 types
    type Element = React.JSX.Element;
  }
}
