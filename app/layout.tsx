import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'نموذج طلب الائتمان | مستودعات عميد البحارة',
  description: 'نموذج طلب ائتمان احترافي للشركات',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} min-h-screen bg-slate-50 font-tajawal text-slate-900`}>{children}</body>
    </html>
  );
}
