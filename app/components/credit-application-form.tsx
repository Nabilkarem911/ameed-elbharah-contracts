'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { SignaturePad } from '@/app/components/signature-pad';
import { submitCreditApplication, type CreditApplicationState } from '@/app/actions/submit-credit-application';

type Props = {
  defaultCompanyName?: string;
  companyId?: string;
  token?: string;
};

const initialState: CreditApplicationState = {
  success: false,
  message: '',
};

export function CreditApplicationForm({ defaultCompanyName = '', companyId, token }: Props) {
  const [state, formAction] = useFormState(submitCreditApplication, initialState);
  const [signature, setSignature] = useState('');

  return (
    <form action={formAction} className="mt-6 space-y-5">
      <input type="hidden" name="companyId" value={companyId ?? ''} />
      <input type="hidden" name="token" value={token ?? ''} />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">اسم الشركة</label>
          <input
            name="companyName"
            defaultValue={defaultCompanyName}
            required
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            placeholder="مثال: شركة الإبداع للتجارة"
          />
          {state.errors?.companyName ? <p className="mt-2 text-sm text-red-600">{state.errors.companyName}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">رقم السجل التجاري</label>
          <input
            name="crNumber"
            required
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            placeholder="مثال: 1012345678"
          />
          {state.errors?.crNumber ? <p className="mt-2 text-sm text-red-600">{state.errors.crNumber}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">الرقم الضريبي</label>
          <input
            name="vatNumber"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            placeholder="مثال: 310123456700003"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">العنوان الوطني</label>
          <input
            name="nationalAddress"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            placeholder="أدخل العنوان الوطني"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">الحد الائتماني</label>
          <input
            name="creditLimit"
            type="number"
            step="0.01"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            placeholder="مثال: 50000"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">فترة الدفع (أيام)</label>
          <input
            name="paymentTerms"
            type="number"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            placeholder="15"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">اسم البنك</label>
          <input
            name="bankName"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            placeholder="مثال: البنك السعودي الفرنسي"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">رقم الآيبان</label>
          <input
            name="iban"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            placeholder="SA03 8000 0000 6080 1016 7519"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">التوقيع الإلكتروني</h3>
          <span className="rounded-full bg-brand-light px-3 py-1 text-sm font-medium text-brand-blue">مطلوب</span>
        </div>
        <SignaturePad value={signature} onChange={setSignature} />
        {state.errors?.signature ? <p className="mt-2 text-sm text-red-600">{state.errors.signature}</p> : null}
      </div>

      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-8 text-amber-900 shadow-sm">
        <h3 className="mb-2 font-bold">إقرار قانوني</h3>
        <p>
          تلتزم الشركة بأن تظل ملكية البضائع الموردة من قبل شركة عميد البحارة مملوكة لها حتى السداد الكامل لكافة المستحقات المالية، وذلك وفقاً للشروط المتفق عليها.
        </p>
        <p className="mt-2">
          ويعد التوقيع الإلكتروني المقدم في هذا النموذج توقيعاً قانونياً ملزماً يخول الشركة بإجراء المعاملات الائتمانية وفقاً للمتطلبات المعلنة.
        </p>
      </div>

      {state.message ? (
        <div className={`rounded-2xl border p-4 text-sm ${state.success ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {state.message}
        </div>
      ) : null}

      <button
        type="submit"
        className="w-full rounded-2xl bg-brand-navy px-6 py-3 text-lg font-semibold text-white transition hover:bg-brand-blue"
      >
        إرسال طلب الائتمان
      </button>
    </form>
  );
}
