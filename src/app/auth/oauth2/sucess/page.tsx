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

      // Redireciona para o dashboard
      router.push('/');
    } else {
      router.push('/login');
    }
  }, [searchParams, router]);

  return <div>Conectando e autenticando...</div>;
}