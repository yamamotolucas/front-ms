'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BarberDashboardColumn } from '@/components/BarberDashboardColumn';

interface Service {
  name: string;
  price: number;
}

interface Appointment {
  bookingId: number;
  barberId: number;
  customerName: string;
  startTime: string; 
  endTime: string;
  services: Service[];
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';
}

interface PopupConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'confirm';
  onConfirm?: () => void;
}

export default function BarberDashboardPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null); // Alterado para controle de conclusão
  const [refreshKey, setRefreshKey] = useState(0);

  const [popupConfig, setPopupConfig] = useState<PopupConfig>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  const showPopup = (title: string, message: string, type: 'success' | 'error' | 'confirm', onConfirm?: () => void) => {
    setPopupConfig({ isOpen: true, title, message, type, onConfirm });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setHasToken(!!token);
  }, []);

  // 🚀 Nova função: Agora conclui o atendimento no backend
  const executeComplete = async (appointment: Appointment) => {
    setCompletingId(appointment.startTime);
    setPopupConfig(prev => ({ ...prev, isOpen: false })); 

    try {
      const response = await fetch(`http://localhost:8080/booking-ms/v1/bookings/complete/${appointment.bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Não foi possível concluir o agendamento no servidor.');

      showPopup('Atendimento Concluído', 'O corte foi finalizado com sucesso no sistema!', 'success', () => {
        setRefreshKey(k => k + 1);
      });

    } catch (error: any) {
      showPopup('Erro ao Concluir', error.message, 'error');
    } finally {
      setCompletingId(null);
    }
  };

  const handleCompleteTrigger = (appointment: Appointment) => {
    showPopup(
      'Concluir Atendimento',
      `Deseja confirmar a conclusão do atendimento de ${appointment.customerName}?`,
      'confirm',
      () => executeComplete(appointment)
    );
  };

  if (hasToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-amber-600" />
      </div>
    );
  }

  if (hasToken === false) {
    return (
      <div className="min-h-screen w-full bg-zinc-50 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-zinc-200 bg-white shadow-xs text-center animate-in zoom-in-95 duration-200">
          <CardContent className="p-6 space-y-4">
            <div className="text-4xl pt-2">🔐</div>
            <h3 className="text-xl font-bold text-zinc-800">Acesso Restrito</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Você precisa estar logado na sua conta profissional para visualizar a sua agenda de trabalho.
            </p>
            <Button 
              onClick={() => window.location.href = '/auth/login'}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 cursor-pointer border-none rounded-lg text-sm transition-all shadow-xs"
            >
              Fazer Login Agora
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 px-4 py-12 flex flex-col items-center relative">
      <div className="w-full max-w-6xl space-y-8">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Minha Agenda</h1>
            <p className="text-zinc-500 text-sm mt-1">Acompanhe seus horários de hoje e marque os serviços concluídos.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* COLUNA 1: FILA DE ATENDIMENTO (SÓ CONFIRMADOS) */}
          <BarberDashboardColumn
            key={`upcoming-${refreshKey}`}
            title="Fila de Atendimento"
            scope="UPCOMING"
            indicatorColor="bg-emerald-500"
            showCompleteButton={true} // Nova prop para o botão Concluir
            completingId={completingId}
            onCompleteTrigger={handleCompleteTrigger}
          />

          {/* COLUNA 2: HISTÓRICO DE ATENDIMENTOS */}
          <BarberDashboardColumn
            key={`past-${refreshKey}`}
            title="Atendimentos Concluídos"
            scope="PAST"
            indicatorColor="bg-zinc-400"
            showCompleteButton={false}
            completingId={completingId}
            onCompleteTrigger={handleCompleteTrigger}
          />

        </div>
      </div>

      {/* --- POP-UP MODAL CUSTOMIZADO --- */}
      {popupConfig.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm border-none shadow-2xl bg-white text-center p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <CardHeader className="p-0">
              <div className="mx-auto my-1 text-4xl text-center">
                {popupConfig.type === 'success' && '✅'}
                {popupConfig.type === 'error' && '❌'}
                {popupConfig.type === 'confirm' && '⚠️'}
              </div>
              <CardTitle className="text-xl text-zinc-800 pt-2">{popupConfig.title}</CardTitle>
              <CardDescription className="text-zinc-500 text-sm font-normal mt-1.5 leading-relaxed">
                {popupConfig.message}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              {popupConfig.type === 'confirm' ? (
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setPopupConfig(prev => ({ ...prev, isOpen: false }))}
                    className="w-1/2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm py-2 font-medium cursor-pointer border-none"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="button"
                    onClick={popupConfig.onConfirm}
                    className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2 font-medium cursor-pointer border-none"
                  >
                    Sim, Concluir
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    setPopupConfig(prev => ({ ...prev, isOpen: false }));
                    if (popupConfig.onConfirm) popupConfig.onConfirm();
                  }}
                  className={`w-full text-white text-sm py-2 font-medium cursor-pointer ${
                    popupConfig.type === 'success' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-zinc-900 hover:bg-zinc-800'
                  }`}
                >
                  Fechar
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}