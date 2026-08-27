'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OAuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');

    if (token) {
      localStorage.setItem('token', token);
      if (role) {
        localStorage.setItem('user_role', role);
      }

      window.dispatchEvent(new Event('storage'));

      router.push('/');
    } else {
      router.push('/auth/login');
    }
  }, [searchParams, router]);

  return <div className="p-8 text-center text-zinc-600">Conectando e autenticando...</div>;
}