import Link from 'next/link';
import { cookies } from 'next/headers';
import { adminLogout } from '@/app/actions/admin-logout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuth = cookies().get('ameed_admin_auth')?.value === '1';

  // Don't show the admin shell around the login page
  if (!isAuth) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 border-r bg-white p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold">لوحة المشرف</h2>
          <p className="text-sm text-slate-500">مستودعات عميد البحارة</p>
        </div>
        <nav className="space-y-2 text-right">
          <Link href="/admin" className="block rounded px-3 py-2 hover:bg-slate-100">جميع الطلبات</Link>
          <Link href="/admin/new-link" className="block rounded px-3 py-2 hover:bg-slate-100">إنشاء رابط جديد</Link>
        </nav>
        <form action={adminLogout} className="mt-8">
          <button type="submit" className="w-full rounded bg-rose-600 px-3 py-2 text-white hover:bg-rose-700">
            تسجيل خروج
          </button>
        </form>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
