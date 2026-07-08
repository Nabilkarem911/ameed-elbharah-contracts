'use client';

import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

type SignaturePadProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SignaturePad({ value, onChange }: SignaturePadProps) {
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleClear = () => {
    signatureRef.current?.clear();
    setIsEmpty(true);
    onChange('');
  };

  const handleEndStroke = () => {
    const dataUrl = signatureRef.current?.toDataURL('image/png') ?? '';
    setIsEmpty(!dataUrl);
    onChange(dataUrl);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{ className: 'w-full h-48 rounded-xl touch-none bg-slate-50' }}
          onEnd={handleEndStroke}
          onBegin={() => setIsEmpty(false)}
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{isEmpty ? 'يرجى التوقيع في المساحة أعلاه' : 'تمت إضافة التوقيع'}</p>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          مسح التوقيع
        </button>
      </div>
      <input type="hidden" name="signature" value={value} />
    </div>
  );
}
