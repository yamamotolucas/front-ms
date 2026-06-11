'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LogoutPage() {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // 1. Limpa o token imediatamente antes de qualquer coisa
    localStorage.removeItem('token');

    // 2. Cria o cronômetro para atualizar a tela a cada segundo
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // 3. Conta 3 segundos e redireciona para a home "/"
    const timeout = setTimeout(() => {
      window.location.href = '/';
    }, 3000);

    // Limpa os timers se o usuário sair da página antes do tempo
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-100 to-zinc-50 px-4">
      <Card className="w-full max-w-md border-dashed border-zinc-200">
        <CardHeader>
          {/* Ícone simples de tchau/sucesso */}
          <div className="mx-auto my-2 text-4xl text-center">👋</div>
          <CardTitle className="text-2xl text-center text-zinc-800">
            Até logo!
          </CardTitle>
          <CardDescription className="text-center">
            Sua sessão foi encerrada com sucesso.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center space-y-4 pb-8">
          {/* Efeito visual simples de carregamento na cor âmbar do seu projeto */}
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-amber-600" />
          
          <p className="text-sm text-zinc-500 text-center animate-pulse">
            Redirecionando para a página inicial em{' '}
            <span className="font-bold text-amber-600 text-lg">{countdown}</span>{' '}
            {countdown === 1 ? 'segundo' : 'segundos'}...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}