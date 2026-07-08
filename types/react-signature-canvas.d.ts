declare module 'react-signature-canvas' {
  import React from 'react';

  type SignatureCanvasProps = {
    ref?: React.Ref<any>;
    canvasProps?: Record<string, unknown>;
    onEnd?: () => void;
    onBegin?: () => void;
    [key: string]: any;
  };

  class SignatureCanvas extends React.Component<SignatureCanvasProps> {
    clear(): void;
    toDataURL(type?: string): string;
  }

  export default SignatureCanvas;
}
