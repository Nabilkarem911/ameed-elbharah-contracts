'use server';

import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

export async function createCompanyLink(formData: FormData) {
  const name = String(formData.get('companyName') ?? '').trim();
  if (!name) return { success: false, message: 'اسم الشركة مطلوب' };

  let company = await prisma.company.findFirst({ where: { name } });
  if (!company) {
    company = await prisma.company.create({ data: { name, applyToken: randomUUID() } });
  } else if (!company.applyToken) {
    company = await prisma.company.update({ where: { id: company.id }, data: { applyToken: randomUUID() } });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const url = `${baseUrl}/apply/${company.id}?token=${company.applyToken}`;

  return { success: true, url, company };
}
