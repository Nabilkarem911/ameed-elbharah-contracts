import { updateApplicationStatus } from '@/app/actions/update-application-status';
import { PrintButton } from '@/app/admin/application/print-button';
import { prisma } from '@/lib/prisma';

type Props = { params: { id: string } };

export default async function ApplicationPage({ params }: Props) {
  try {
    const app = await prisma.creditApplication.findUnique({ where: { id: params.id } });
    if (!app) return <div className="p-6">لم يتم العثور على الطلب.</div>;

    return (
      <div className="max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">تفاصيل طلب الائتمان</h1>
          <div className="flex gap-2">
            <form action={updateApplicationStatus.bind(null, app.id, 'APPROVED')}>
              <button className="rounded bg-emerald-600 px-4 py-2 text-white no-print">قبول</button>
            </form>
            <form action={updateApplicationStatus.bind(null, app.id, 'REJECTED')}>
              <button className="rounded bg-rose-600 px-4 py-2 text-white no-print">رفض</button>
            </form>
            <PrintButton />
          </div>
        </div>

        <div className="mb-4 rounded bg-white p-4 text-sm text-slate-600">
          <p>الحالة الحالية: <span className="font-semibold">{app.status}</span></p>
        </div>

        <div className="rounded bg-white p-6" id="print-area">
          <section className="mb-4 text-right">
            <h2 className="text-lg font-semibold">بيانات الشركة</h2>
            <p>الاسم: {app.companyName}</p>
            <p>السجل: {app.crNumber}</p>
            <p>الرقم الضريبي: {app.vatNumber ?? '-'}</p>
            <p>العنوان: {app.nationalAddress ?? '-'}</p>
          </section>

          <section className="mb-4 text-right">
            <h2 className="text-lg font-semibold">تفاصيل الائتمان</h2>
            <p>الحد الائتماني: {app.creditLimit ? app.creditLimit.toString() : '-'}</p>
            <p>فترة الدفع: {app.paymentTerms ?? '-'} يوم</p>
            <p>البنك: {app.bankName ?? '-'}</p>
            <p>آيبان: {app.iban ?? '-'}</p>
          </section>

          <section className="mb-4 text-right">
            <h2 className="text-lg font-semibold">الإقرار والتوقيع</h2>
            <p className="mb-4">تلتزم الشركة بأن تظل ملكية البضائع الموردة من قبل مستودعات عميد البحارة مملوكة لها حتى السداد الكامل.</p>
            {app.signatureImage ? <img src={app.signatureImage} alt="signature" className="w-64" /> : <p>-</p>}
          </section>
        </div>
      </div>
    );
  } catch (err: any) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">تعذر تحميل الطلب</h1>
        <p className="mt-3 text-sm text-slate-700">{String(err?.message ?? err)}</p>
      </div>
    );
  }
}
