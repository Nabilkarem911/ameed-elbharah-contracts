'use server';

import { cookies } from 'next/headers';

export async function adminLogin(_prevState: any, formData: FormData | Record<string, any>) {
  let username = '';
  let password = '';

  // support both FormData and plain object payloads
  if (formData && typeof (formData as any).get === 'function') {
    username = String((formData as FormData).get('username') ?? '');
    password = String((formData as FormData).get('password') ?? '');
  } else if (formData && typeof formData === 'object') {
    username = String((formData as any).username ?? '');
    password = String((formData as any).password ?? '');
  }

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    cookies().set({ name: 'ameed_admin_auth', value: '1', httpOnly: true, path: '/admin' });
    return { success: true };
  }

  return { success: false, message: 'بيانات اعتماد غير صحيحة' };
}
