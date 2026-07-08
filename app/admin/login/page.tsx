'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { adminLogin } from '@/app/actions/admin-login';

export default function AdminLoginPage() {
  const [state, action] = useFormState(adminLogin, { success: false, message: '' });
  const [error, setError] = useState('');

  if ((state as any).success) {
    if (typeof window !== 'undefined') window.location.href = '/admin';
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full rounded-xl border bg-white p-8">
        <h1 className="text-xl font-bold">تسجيل دخول المشرف</h1>
        <form action={action} className="mt-4 space-y-4" onSubmit={() => setError('')}>
          <div>
            <label className="block text-sm">اسم المستخدم</label>
            <input name="username" className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm">كلمة المرور</label>
            <input name="password" type="password" className="w-full rounded border px-3 py-2" />
          </div>
          {state.message ? <div className="text-sm text-red-600">{(state as any).message}</div> : null}
          <div>
            <button type="submit" className="w-full rounded bg-brand-navy px-4 py-2 text-white">تسجيل دخول</button>
          </div>
        </form>
      </div>
    </main>
  );
}
