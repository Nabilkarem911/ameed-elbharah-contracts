import { prisma } from '@/lib/prisma';
import { CreditApplicationForm } from '@/app/components/credit-application-form';

type Props = {
  params: { companyId: string };
  searchParams?: { token?: string | string[] };
};

export default async function ApplyPage({ params, searchParams }: Props) {
  try {
    const company = await prisma.company.findUnique({ where: { id: params.companyId } });
    const token = Array.isArray(searchParams?.token) ? searchParams.token[0] : searchParams?.token;

    if (!company || !company.applyToken || token !== company.applyToken) {
      return (
        <main className="min-h-screen px-4 py-10 text-right sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
            <h1 className="text-2xl font-bold">الرابط غير صالح</h1>
            <p className="mt-3">الرابط المرسل إليك غير صالح أو منتهي الصلاحية. يرجى التواصل مع الإدارة.</p>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen px-4 py-10 text-right sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white p-8 shadow-2xl shadow-blue-100/60">
            <h1 className="text-2xl font-bold">نموذج طلب الائتمان - تعبئة للعميل</h1>
            <p className="mt-2 text-sm text-slate-600">يرجى تعبئة النموذج التالي لإرسال طلب الائتمان الخاص بشركتكم.</p>

            <CreditApplicationForm defaultCompanyName={company.name} companyId={params.companyId} token={token} />
          </section>
        </div>
      </main>
    );
  } catch (err: any) {
    return (
      <main className="min-h-screen px-4 py-10 text-right sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
          <h1 className="text-2xl font-bold">تعذر تحميل النموذج</h1>
          <p className="mt-3">{String(err?.message ?? err)}</p>
        </div>
      </main>
    );
  }
}
