# مستودعات عميد البحارة — نظام طلبات الائتمان

هذا المشروع عبارة عن تطبيق Next.js احترافي لإدارة طلبات الائتمان للشركات مع:

- واجهة عربية بالكامل (RTL)
- نموذج طلب ائتمان للشركات
- توقيع إلكتروني عبر Canvas
- لوحة تحكم إدارية للمشرف
- إنشاء روابط مخصصة للعميل
- مراجعة الطلبات وقبولها أو رفضها
- طباعة العقد أو حفظه كـ PDF من المتصفح
- قاعدة بيانات PostgreSQL مع Prisma
- إعداد Docker جاهز للنشر على VPS أو Dokploy

## المميزات الرئيسية

- نموذج عميل مخصص عبر رابط آمن `/apply/[companyId]?token=...`
- لوحة مشرف `/admin`
- إنشاء رابط جديد للعميل `/admin/new-link`
- عرض تفاصيل الطلب `/admin/application/[id]`
- عرض جميع الطلبات المرتبطة بشركة واحدة `/admin/company/[companyId]`
- دعم الطباعة والتصدير إلى PDF من خلال المتصفح

## المتطلبات

- Node.js 20+
- npm أو pnpm
- PostgreSQL 16+
- Docker و Docker Compose (اختياري لكن موصى به)

## التثبيت محلياً

1. انسخ ملف البيئة:

```bash
cp .env.example .env
```

2. عدّل ملف `.env` وأدخل بيانات قاعدة البيانات:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ameed_credit?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="changeme"
```

3. ثبت التبعيات:

```bash
npm install
```

4. أنشئ قاعدة البيانات وشغّل الـ migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. شغّل التطبيق:

```bash
npm run dev
```

الواجهة ستكون متاحة على:

- Frontend: http://localhost:3000
- Admin Login: http://localhost:3000/admin/login

## التشغيل عبر Docker Compose

هذا المشروع جاهز للتشغيل من خلال Docker Compose.

```bash
docker compose up --build -d
```

سيتم تشغيل:
- التطبيق على المنفذ `3000`
- PostgreSQL على المنفذ `5432`

للتشغيل مع الـ migrations عند البدء، تم إعداد الأمر داخل Dockerfile بحيث يعمل تلقائياً:

```bash
npx prisma migrate deploy && npm run start
```

## النشر على VPS مع Dokploy

إذا كنت تستخدم Dokploy، يمكنك نشر المشروع بسهولة من خلال GitHub أو من خلال Docker Compose.

### الخيار 1: نشر من GitHub داخل Dokploy

1. أضف المستودع إلى Dokploy.
2. أنشئ تطبيق جديد.
3. اختر:
   - Build Type: Dockerfile
   - Dockerfile: `Dockerfile`
   - Port: `3000`
4. أضف المتغيرات البيئية التالية:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/ameed_credit?schema=public
NEXT_PUBLIC_APP_URL=https://your-domain.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-strong-password
NODE_ENV=production
```

5. إذا كنت تستخدم PostgreSQL منفصل، تأكد من أن `DATABASE_URL` يشير إلى قاعدة البيانات الصحيحة.
6. أنشئ خدمة قاعدة البيانات أو استخدم خدمة PostgreSQL منفصلة في Dokploy.
7. شغّل النشر.

### الخيار 2: استخدام Docker Compose داخل Dokploy

إذا كان لديك Docker Compose جاهز في المستودع، يمكنك إنشاء خدمة Compose داخل Dokploy أو تشغيلها يدويًا على VPS.

```bash
docker compose up --build -d
```

## متغيرات البيئة المهمة

- `DATABASE_URL`: رابط اتصال PostgreSQL
- `NEXT_PUBLIC_APP_URL`: رابط التطبيق العام (مثال: `https://contracts.example.com`)
- `ADMIN_USERNAME`: اسم المستخدم للوحة الإدارة
- `ADMIN_PASSWORD`: كلمة المرور للوحة الإدارة

## ملاحظات مهمة قبل الإنتاج

- غيّر كلمة المرور الافتراضية `changeme` قبل الإطلاق.
- استخدم HTTPS في الإنتاج.
- استخدم `NEXT_PUBLIC_APP_URL` بشكل صحيح حتى تعمل الروابط المرسلة للعميل بشكل صحيح.
- إذا أردت، يمكن لاحقًا إضافة:
  - إرسال الرابط تلقائيًا عبر البريد/واتساب
  - صفحة حالة الطلب للعميل
  - توقيع إلكتروني أقوى مع PDF مُولد من السيرفر
