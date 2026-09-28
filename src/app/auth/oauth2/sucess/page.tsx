'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function OAuthSuccessContent() {
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

export default function OAuthSuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-600">Carregando...</div>}>
      <OAuthSuccessContent />
    </Suspense>
  );
}