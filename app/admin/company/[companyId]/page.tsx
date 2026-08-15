import { prisma } from '@/lib/prisma';
import Link from 'next/link';

type Props = { params: { companyId: string } };

export default async function CompanyPage({ params }: Props) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: params.companyId },
      include: { creditApplications: { orderBy: { createdAt: 'desc' } } },
    });

    if (!company) return <div className="p-6">لم يتم العثور على الشركة.</div>;

    return (
      <div>
        <h1 className="text-2xl font-bold">تفاصيل الشركة</h1>
        <div className="mt-4 rounded border bg-white p-4">
          <p><span className="font-semibold">الاسم:</span> {company.name}</p>
          <p><span className="font-semibold">تاريخ الإنشاء:</span> {new Date(company.createdAt).toLocaleString('ar-EG')}</p>
        </div>

        <div className="mt-6 rounded border bg-white p-4">
          <h2 className="text-lg font-semibold">الطلبات المرتبطة</h2>
          <div className="mt-3 space-y-3">
            {company.creditApplications.length === 0 ? (
              <p className="text-sm text-slate-500">لا توجد طلبات لهذه الشركة.</p>
            ) : (
              company.creditApplications.map((app) => (
                <div key={app.id} className="flex flex-wrap items-center justify-between gap-3 rounded border p-3">
                  <div>
                    <p className="font-semibold">{app.companyName}</p>
                    <p className="text-sm text-slate-500">{app.crNumber} • {app.status}</p>
                  </div>
                  <Link href={`/admin/application/${app.id}`} className="text-blue-600">عرض الطلب</Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  } catch (err: any) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">تعذر تحميل بيانات الشركة</h1>
        <p className="mt-3 text-sm text-slate-700">{String(err?.message ?? err)}</p>
      </div>
    );
  }
}
