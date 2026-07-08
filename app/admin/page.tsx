import { prisma } from '@/lib/prisma';
import Link from 'next/link';

type Props = {
  searchParams?: { q?: string; status?: string };
};

export default async function AdminIndex({ searchParams }: Props) {
  try {
    const q = searchParams?.q?.trim() ?? '';
    const status = searchParams?.status?.trim() ?? '';

    const apps = await prisma.creditApplication.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(q
          ? {
              OR: [
                { companyName: { contains: q, mode: 'insensitive' } },
                { crNumber: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">ملخص الطلبات</h1>
          <Link href="/admin/new-link" className="rounded bg-brand-navy px-4 py-2 text-sm text-white">إنشاء رابط جديد</Link>
        </div>

        <form method="get" className="mt-4 flex flex-wrap gap-3 rounded border bg-white p-4">
          <input name="q" defaultValue={q} placeholder="ابحث باسم الشركة أو رقم السجل" className="min-w-72 rounded border px-3 py-2" />
          <select name="status" defaultValue={status} className="rounded border px-3 py-2">
            <option value="">كل الحالات</option>
            <option value="PENDING">معلق</option>
            <option value="APPROVED">مقبول</option>
            <option value="REJECTED">مرفوض</option>
          </select>
          <button className="rounded bg-slate-800 px-4 py-2 text-white">تصفية</button>
        </form>

        <div className="mt-6 overflow-auto rounded-lg border bg-white p-4">
          <table className="w-full table-auto text-right">
            <thead>
              <tr className="text-sm text-slate-600">
                <th className="p-2">اسم الشركة</th>
                <th className="p-2">رقم السجل</th>
                <th className="p-2">الحالة</th>
                <th className="p-2">تاريخ</th>
                <th className="p-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-2">{a.companyName}</td>
                  <td className="p-2">{a.crNumber}</td>
                  <td className="p-2">{a.status}</td>
                  <td className="p-2">{new Date(a.createdAt).toLocaleString('ar-EG')}</td>
                  <td className="p-2 flex gap-2">
                    <Link href={`/admin/application/${a.id}`} className="text-blue-600">عرض</Link>
                    <Link href={`/admin/company/${a.companyId}`} className="text-emerald-600">شركة</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } catch (err: any) {
    // Show a friendly message when DB is unavailable
    return (
      <div className="rounded bg-white p-6">
        <h1 className="text-2xl font-bold text-red-600">تعذّر الاتصال بقاعدة البيانات</h1>
        <p className="mt-3 text-sm text-slate-700">يبدو أن الخادم المحلي لقاعدة البيانات غير متاح أو أن الإعدادات خاطئة.</p>
        <div className="mt-4 rounded border bg-slate-50 p-4">
          <p className="font-medium">أوامر مقترحة للتصحيح:</p>
          <ul className="mt-2 list-disc pr-5 text-sm">
            <li>ابدأ خدمة PostgreSQL عبر Docker Compose: <code>docker compose up -d db</code></li>
            <li>أو تأكد من تشغيل PostgreSQL محلياً وتحقق من قيمة <code>DATABASE_URL</code> في ملف <code>.env</code>.</li>
            <li>لتطبيق التغييرات في Prisma: <code>npx prisma migrate dev --name add-apply-token</code></li>
          </ul>
        </div>
        <p className="mt-3 text-xs text-slate-500">تفاصيل الخطأ (للمطور): {String(err?.message ?? err)}</p>
      </div>
    );
  }
}
