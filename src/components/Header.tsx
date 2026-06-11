'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Header() {
  const token = localStorage.getItem('token');
  return (
    <header className="w-full bg-white border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-amber-600">
          ✂️ Barbearia Network
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-zinc-700 hover:text-amber-600 font-medium transition-colors">
            Home
          </Link>
          <Link href="/dashboard" className="text-zinc-700 hover:text-amber-600 font-medium transition-colors">
            Dashboard
          </Link>
          <Link href="/conta" className="text-zinc-700 hover:text-amber-600 font-medium transition-colors">
            Conta
          </Link>
          <Link href="/agendar" className="text-zinc-700 hover:text-amber-600 font-medium transition-colors">
            Agendar
          </Link>
          {token ? (
            <Button
              variant="outline"
              onClick={() => window.location.href = '/auth/logout'}
              className="px-4 py-2 text-sm"
            >
              Sair
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => window.location.href = '/auth/login'}
              className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white"
            >
              Entrar
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
