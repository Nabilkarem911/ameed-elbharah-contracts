'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const formSchema = z.object({
  companyId: z.string().trim().min(1, 'معرّف الشركة مفقود'),
  token: z.string().trim().min(1, 'رمز التحقق مفقود'),
  companyName: z.string().trim().min(1, 'اسم الشركة مطلوب'),
  crNumber: z.string().trim().min(1, 'رقم السجل التجاري مطلوب'),
  vatNumber: z.string().trim().optional().or(z.literal('')),
  nationalAddress: z.string().trim().optional().or(z.literal('')),
  creditLimit: z.string().trim().optional().or(z.literal('')),
  paymentTerms: z.string().trim().optional().or(z.literal('')),
  bankName: z.string().trim().optional().or(z.literal('')),
  iban: z.string().trim().optional().or(z.literal('')),
  signature: z.string().trim().min(1, 'يرجى توقيع النموذج قبل الإرسال'),
});

export type CreditApplicationState = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

export async function submitCreditApplication(
  _prevState: CreditApplicationState,
  formData: FormData,
): Promise<CreditApplicationState> {
  const raw = Object.fromEntries(formData.entries());
  const validation = formSchema.safeParse(raw);

  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    return {
      success: false,
      message: 'يرجى مراجعة الحقول المعبأة.',
      errors: Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, value?.[0] ?? ''])),
    };
  }

  const data = validation.data;
  const creditLimit = data.creditLimit !== '' ? Number(data.creditLimit) : null;
  const paymentTerms = data.paymentTerms !== '' ? Number(data.paymentTerms) : null;

  try {
    const company = await prisma.company.findUnique({ where: { id: data.companyId } });
    if (!company || !company.applyToken || company.applyToken !== data.token) {
      return { success: false, message: 'رابط التقديم غير صالح.' };
    }

    const application = await prisma.creditApplication.create({
      data: {
        companyId: company.id,
        companyName: data.companyName,
        crNumber: data.crNumber,
        vatNumber: data.vatNumber || null,
        nationalAddress: data.nationalAddress || null,
        creditLimit,
        paymentTerms,
        bankName: data.bankName || null,
        iban: data.iban || null,
        signatureImage: data.signature,
      },
    });

    revalidatePath('/admin');
    revalidatePath(`/admin/company/${company.id}`);
    revalidatePath(`/admin/application/${application.id}`);

    return {
      success: true,
      message: 'تم إرسال طلب الائتمان بنجاح. سيتم مراجعة الطلب خلال أقرب وقت.',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى.',
    };
  }
}
