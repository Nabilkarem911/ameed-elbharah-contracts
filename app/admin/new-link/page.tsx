'use client';

import { createCompanyLink } from '@/app/actions/create-company-link';
import { useState } from 'react';
import { useFormState } from 'react-dom';

export default function NewLinkPage() {
  const [state, action] = useFormState(createCompanyLink, { success: false, url: '' } as any);
  const [copied, setCopied] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-bold">إنشاء رابط تعبئة للعميل</h1>
      <div className="mt-4 rounded bg-white p-6">
        <form action={action} className="flex gap-3">
          <input name="companyName" placeholder="اسم الشركة" className="flex-1 rounded border px-3 py-2" />
          <button type="submit" className="rounded bg-brand-navy px-4 py-2 text-white">إنشاء</button>
        </form>

        {state.message && !state.url ? (
          <p className="mt-3 text-sm text-red-600">{state.message}</p>
        ) : null}

        {state.url ? (
          <div className="mt-4">
            <p className="text-sm">الرابط:</p>
            <div className="mt-2 flex gap-2">
              <input readOnly value={state.url} className="flex-1 rounded border px-3 py-2" />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(state.url);
                  setCopied(true);
                }}
                className="rounded bg-slate-200 px-4 py-2"
                type="button"
              >
                {copied ? 'تم النسخ' : 'نسخ'}
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500">يمكنك الآن إرسال هذا الرابط للعميل عبر الواتساب أو البريد الإلكتروني.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
