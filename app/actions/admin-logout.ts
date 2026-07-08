'use server';

import { cookies } from 'next/headers';

export async function adminLogout() {
  cookies().delete('ameed_admin_auth');
  return { success: true };
}
