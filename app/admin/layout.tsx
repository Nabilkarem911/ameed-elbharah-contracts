import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 border-r bg-white p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold">لوحة المشرف</h2>
          <p className="text-sm text-slate-500">مستودعات عميد البحارة</p>
        </div>
        <nav className="space-y-2 text-right">
          <Link href="/admin" className="block rounded px-3 py-2 hover:bg-slate-100">لوحة التحكم</Link>
          <Link href="/admin/new-link" className="block rounded px-3 py-2 hover:bg-slate-100">إنشاء رابط جديد</Link>
          <Link href="/admin/all" className="block rounded px-3 py-2 hover:bg-slate-100">جميع الطلبات</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
