'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Header() {
  const [token, setHasToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // 🚀 Correção de Hidratação: Lê o localStorage apenas quando o componente monta no navegador
  useEffect(() => {
    setHasToken(localStorage.getItem('token'));
    setRole(localStorage.getItem('user_role'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    window.location.href = '/auth/login';
  };

  return (
    <header className="w-full bg-white border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-amber-600 select-none">
          ✂️ Barbearia Network
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-zinc-700 hover:text-amber-600 font-medium transition-colors">
            Home
          </Link>

          {/* 💈 MENUS DO CLIENTE (CUSTOMER) */}
          {token && role === 'CUSTOMER' && (
            <>
              <Link href="/dashboard" className="text-zinc-700 hover:text-amber-600 font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/agendar" className="text-zinc-700 hover:text-amber-600 font-medium transition-colors">
                Agendar
              </Link>
            </>
          )}

          {/* 💈 MENUS DO BARBEIRO (BARBER) */}
          {token && role === 'BARBER' && (
            <>
              <Link href="/agenda" className="text-zinc-700 hover:text-amber-600 font-medium transition-colors">
                Minha Agenda
              </Link>
              <Link href="/barber/servicos" className="text-zinc-700 hover:text-amber-600 font-medium transition-colors">
                Serviços
              </Link>
            </>
          )}

          {/* ⚙️ MENU EM COMUM (Sempre por último se estiver logado) */}
          {token && (
            <Link href="/conta" className="text-zinc-700 hover:text-amber-600 font-medium transition-colors">
              Conta
            </Link>
          )}

          {/* 🔐 CONTROLE DE LOGIN / LOGOUT */}
          {token ? (
            <Button
              variant="outline"
              onClick={handleLogout}
              className="px-4 py-2 text-sm cursor-pointer"
            >
              Sair
            </Button>
          ) : (
            <Button
              onClick={() => window.location.href = '/auth/login'}
              className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white font-medium cursor-pointer rounded-lg border-none"
            >
              Entrar
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}