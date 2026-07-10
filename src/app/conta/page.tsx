'use client';

import { useState, useEffect } from 'react';
import { AccountSettings } from '@/components/AccountSettings';
import { BarberSettings } from '@/components/BarberSettings';

export default function ContaPage() {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('user_role');
    setRole(userRole);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-zinc-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-amber-600" />
      </div>
    );
  }

  return (
    /* O container controla o fundo cinza claro e o alinhamento para os dois blocos */
    <div className="min-h-screen w-full bg-zinc-50 text-zinc-900 px-4 py-12 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* FORMULÁRIO 1: Dados Gerais (Nome, Email e Senhas) */}
        <AccountSettings />

        {/* FORMULÁRIO 2: Dados de Barbeiro (Injetado dinamicamente caso seja BARBER) */}
        {role === 'BARBER' && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
            <BarberSettings />
          </div>
        )}
        
      </div>
    </div>
  );
}