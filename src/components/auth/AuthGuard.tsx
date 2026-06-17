'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'; 
import { Button } from '@/components/ui/Button';

const publicRoutes = ['/auth/login', '/auth/registro', '/auth/logout'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (publicRoutes.includes(pathname)) return;

    const isDismissed = sessionStorage.getItem('dismissed_expiration_popup');
    if (isDismissed === 'true') return;

    const checkSession = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        handleSessionExpired();
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/identity-ms/v1/auth/validate?token=${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          handleSessionExpired();
        }
      } catch (error) {
        console.error('Erro ao validar sessão:', error);
      }
    };

    const handleSessionExpired = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user_role');
      setShowPopup(true);
    };

    checkSession();
  }, [pathname]); 

  const handleDismissPopup = () => {
    sessionStorage.setItem('dismissed_expiration_popup', 'true');
    setShowPopup(false);
    window.location.reload();
  };

  return (
    <>
      {children}

      {/* POP-UP DE SESSÃO EXPIRADA */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full text-center space-y-4 shadow-xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-4xl">⚠️</div>
            <h2 className="text-xl font-bold text-zinc-900">Sessão Expirada</h2>
            <p className="text-sm text-zinc-600 text-center">
              Seu tempo de conexão acabou. Por favor, faça login novamente para continuar agendando.
            </p>
            
            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={() => window.location.href = '/auth/login'}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm py-2.5"
              >
                Ir para o Login
              </Button>
              
              <Button
                variant="outline"
                onClick={handleDismissPopup} 
                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-none font-medium text-sm py-2.5"
              >
                Agora não
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}