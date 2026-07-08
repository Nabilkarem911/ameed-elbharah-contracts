'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const formSchema = z.object({
  companyId: z.string().optional(),
  token: z.string().optional(),
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
  const creditLimit = data.creditLimit ? Number(data.creditLimit) : null;
  const paymentTerms = data.paymentTerms ? Number(data.paymentTerms) : null;

  try {
    let createdCompany = null;
    if (data.companyId) {
      createdCompany = await prisma.company.findUnique({ where: { id: data.companyId } });
      if (createdCompany && data.token && createdCompany.applyToken && createdCompany.applyToken !== data.token) {
        return { success: false, message: 'رابط التقديم غير صالح.' };
      }
    }
    if (!createdCompany) {
      const existing = await prisma.company.findFirst({ where: { name: data.companyName } });
      createdCompany = existing ?? (await prisma.company.create({ data: { name: data.companyName } }));
    }

    await prisma.creditApplication.create({
      data: {
        companyId: createdCompany.id,
        companyName: data.companyName,
        crNumber: data.crNumber,
        vatNumber: data.vatNumber || null,
        nationalAddress: data.nationalAddress || null,
        creditLimit: creditLimit ? creditLimit : null,
        paymentTerms: paymentTerms ? paymentTerms : null,
        bankName: data.bankName || null,
        iban: data.iban || null,
        signatureImage: data.signature,
      },
    });

    revalidatePath('/');

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
