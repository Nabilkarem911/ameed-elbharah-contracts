'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function updateApplicationStatus(id: string, status: 'APPROVED' | 'REJECTED') {
  const application = await prisma.creditApplication.findUnique({ where: { id } });
  if (!application) return;

  await prisma.creditApplication.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/admin');
  revalidatePath(`/admin/application/${id}`);
  revalidatePath(`/admin/company/${application.companyId}`);
}
