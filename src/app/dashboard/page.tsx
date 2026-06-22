'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DashboardColumn } from '@/components/DashboardColumn';

interface Service {
  name: string;
  price: number;
}

interface Appointment {
  bookingId: number;
  barberId: number;
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

export default function DashboardPage() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  
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

  const executeCancel = async (appointment: Appointment) => {
    setCancellingId(appointment.startTime);
    setPopupConfig(prev => ({ ...prev, isOpen: false })); 

    try {
      const response = await fetch(`http://localhost:8080/booking-ms/v1/bookings/cancel/${appointment.bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Não foi possível cancelar o agendamento no servidor.');

      showPopup('Sucesso', 'Seu agendamento foi cancelado com sucesso.', 'success', () => {
        setRefreshKey(k => k + 1);
      });

    } catch (error: any) {
      showPopup('Erro ao Cancelar', error.message, 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const handleCancelTrigger = (appointment: Appointment) => {
    showPopup(
      'Cancelar Agendamento',
      'Tem certeza absoluta de que deseja cancelar este agendamento? Esta ação não poderá ser desfeita.',
      'confirm',
      () => executeCancel(appointment)
    );
  };

  if (hasToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 px-4 py-12 flex flex-col items-center relative">
      <div className="w-full max-w-6xl space-y-8">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meu Painel</h1>
            <p className="text-zinc-500 text-sm mt-1">Gerencie suas reservas e histórico de cortes.</p>
          </div>
          <Button 
            onClick={() => window.location.href = '/agendar'}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 shadow-sm cursor-pointer"
          >
            + Novo Agendamento
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* COLUNA 1: PRÓXIMOS AGENDAMENTOS */}
          <DashboardColumn
            key={`upcoming-${refreshKey}`}
            title="Próximos Agendamentos"
            scope="UPCOMING"
            indicatorColor="bg-emerald-500"
            showCancelButton={true}
            cancellingId={cancellingId}
            onCancelTrigger={handleCancelTrigger}
          />

          {/* COLUNA 2: HISTÓRICO DE ATENDIMENTOS */}
          <DashboardColumn
            key={`past-${refreshKey}`}
            title="Histórico de Atendimentos"
            scope="PAST"
            indicatorColor="bg-zinc-400"
            showCancelButton={false}
            cancellingId={cancellingId}
            onCancelTrigger={handleCancelTrigger}
          />

        </div>
      </div>

      {/* --- POP-UP MODAL CUSTOMIZADO UNIFICADO --- */}
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
                    className="w-1/2 bg-red-600 hover:bg-red-700 text-white text-sm py-2 font-medium cursor-pointer border-none"
                  >
                    Sim, cancelar
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