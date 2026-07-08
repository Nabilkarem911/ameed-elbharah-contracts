export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl rounded-xl border bg-white p-8 text-center">
        <h1 className="text-2xl font-bold">مستودعات عميد البحارة — نمــوذج طلب الائتمان</h1>
        <p className="mt-4 text-sm text-slate-600">لإدارة الطلبات، سجّل الدخول إلى لوحة التحكم الداخلية.</p>
        <div className="mt-6">
          <a href="/admin/login" className="rounded-full bg-brand-navy px-6 py-3 text-white">تسجيل دخول المشرف</a>
        </div>
      </div>
    </main>
  );
}
