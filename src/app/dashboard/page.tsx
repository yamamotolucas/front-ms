'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// --- INTERFACES ---
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
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}

interface PopupConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'confirm';
  onConfirm?: () => void;
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

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
    async function fetchDashboardData() {
      try {
        const response = await fetch('http://localhost:8080/booking-ms/v1/bookings/myBookings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Erro ao buscar dados do painel');
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error(error);
        showPopup('Erro de Conexão', 'Não foi possível carregar seu histórico.', 'error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // --- EXECUÇÃO DO CANCELAMENTO APÓS CONFIRMAÇÃO ---
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

      if (!response.ok) {
        console.log(response);
        throw new Error('Não foi possível cancelar o agendamento no servidor.');
      }

      showPopup('Sucesso', 'Seu agendamento foi cancelado com sucesso.', 'success', () => {
        window.location.reload(); 
      });

    } catch (error: any) {
      showPopup('Erro ao Cancelar', error.message, 'error');
    } finally {
      setCancellingId(null);
    }
  };

  // --- ENGATILHA O POP-UP DE CONFIRMAÇÃO ---
  const handleCancelBooking = (appointment: Appointment) => {
    showPopup(
      'Cancelar Agendamento',
      'Tem certeza absoluta de que deseja cancelar este agendamento? Esta ação não poderá ser desfeita.',
      'confirm',
      () => executeCancel(appointment)
    );
  };

  // --- REGRAS DE FILTRAGEM DINÂMICA DE DATAS ---
  const now = new Date();

  const upcomingAppointments = appointments.filter(app => {
    const appDate = new Date(app.startTime);
    return appDate >= now && app.bookingStatus !== 'CANCELLED' && app.bookingStatus !== 'COMPLETED';
  });

  const pastAppointments = appointments.filter(app => {
    const appDate = new Date(app.startTime);
    return appDate < now || app.bookingStatus === 'CANCELLED' || app.bookingStatus === 'COMPLETED';
  });

  // --- AUXILIARES DE FORMATAÇÃO ---
  const formatDateTimeBR = (isoString: string) => {
    const date = new Date(isoString);
    const dateStr = date.toLocaleDateString('pt-BR');
    const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return { dateStr, timeStr };
  };

  const calculateTotal = (services: Service[]) => {
    return services.reduce((acc, current) => acc + current.price, 0).toFixed(2);
  };

  if (isLoading) {
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

        {/* LAYOUT EM DUAS COLUNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* COLUNA 1: FUTUROS E PENDENTES */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-emerald-500" />
              <h2 className="text-xl font-bold text-zinc-800">Próximos Agendamentos</h2>
              <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                {upcomingAppointments.length}
              </span>
            </div>

            {upcomingAppointments.length === 0 ? (
              <Card className="border-dashed border-zinc-200 bg-white">
                <CardContent className="p-8 text-center text-zinc-400 italic text-sm">
                  Nenhum agendamento marcado para os próximos dias.
                </CardContent>
              </Card>
            ) : (
              upcomingAppointments.map((app, index) => {
                const { dateStr, timeStr } = formatDateTimeBR(app.startTime);
                const isOverdue = new Date(app.startTime) < now;

                const tooltipMessage = app.bookingStatus === 'PENDING'
                  ? "Para confirmar o agendamento, verifique seu e-mail e clique no link de validação recebido."
                  : "Seu agendamento está confirmado! Lembramos que temos uma tolerância de até 10 minutos de atraso.";

                return (
                  <Card key={index} className="border-zinc-200 bg-white shadow-xs hover:border-zinc-300 transition-all">
                    <CardContent className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold px-2 py-0.5 rounded border ${
                            isOverdue 
                              ? 'bg-red-50 text-red-700 border-red-200' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {timeStr}
                          </span>
                          <span className="text-sm font-medium text-zinc-600">{dateStr}</span>
                          
                          {/* CSS Tooltip Instantâneo */}
                          <div className="relative flex items-center group">
                            <span 
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ml-1 cursor-pointer transition-all ${
                                app.bookingStatus === 'CONFIRMED' 
                                  ? 'bg-emerald-600 text-white shadow-xs' 
                                  : 'bg-zinc-200 text-zinc-700 border border-zinc-300'
                              }`}
                            >
                              {app.bookingStatus === 'CONFIRMED' ? 'Confirmado' : 'Pendente'}
                            </span>
                            
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-zinc-900 text-white text-xs rounded-lg p-2.5 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-xl z-10 text-center leading-normal">
                              {tooltipMessage}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                            </div>
                          </div>

                        </div>
                        <h4 className="font-bold text-zinc-800 text-base">Barbeiro ID: {app.barberId}</h4>
                        <p className="text-xs text-zinc-500">
                          <span className="font-medium text-zinc-400">Serviços:</span> {app.services.map(s => s.name).join(', ')}
                        </p>
                        <p className="text-sm font-bold text-amber-600">R$ {calculateTotal(app.services)}</p>
                      </div>

                      <Button
                        onClick={() => handleCancelBooking(app)}
                        isLoading={cancellingId === app.startTime}
                        className="bg-red-600 text-white hover:bg-red-700 text-xs font-bold py-2 px-4 rounded-lg self-start sm:self-center shadow-sm transition-all cursor-pointer border-none"
                      >
                        Cancelar
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* COLUNA 2: HISTÓRICO / PASSADOS */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-zinc-400" />
              <h2 className="text-xl font-bold text-zinc-800">Histórico de Atendimentos</h2>
              <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                {pastAppointments.length}
              </span>
            </div>

            {pastAppointments.length === 0 ? (
              <Card className="border-dashed border-zinc-200 bg-white">
                <CardContent className="p-8 text-center text-zinc-400 italic text-sm">
                  Seu histórico de agendamentos está vazio.
                </CardContent>
              </Card>
            ) : (
              pastAppointments.map((app, index) => {
                const { dateStr, timeStr } = formatDateTimeBR(app.startTime);
                return (
                  <Card key={index} className="border-zinc-150 bg-zinc-50/50 opacity-85">
                    <CardContent className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <span className="text-xs font-medium bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded">
                            {timeStr}
                          </span>
                          <span className="text-xs">{dateStr}</span>
                          
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                            app.bookingStatus === 'CANCELLED' 
                              ? 'bg-red-50 text-red-600 border-red-100' 
                              : app.bookingStatus === 'COMPLETED'
                              ? 'bg-blue-50 text-blue-600 border-blue-100'
                              : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                          }`}>
                            {app.bookingStatus === 'CANCELLED' ? 'Cancelado' : app.bookingStatus === 'COMPLETED' ? 'Concluído' : app.bookingStatus}
                          </span>
                        </div>
                        <h4 className="font-semibold text-zinc-700 text-sm">Barbeiro ID: {app.barberId}</h4>
                        <p className="text-xs text-zinc-400">
                          {app.services.map(s => s.name).join(', ')}
                        </p>
                        <p className="text-xs font-semibold text-zinc-500">Total: R$ {calculateTotal(app.services)}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

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
              <CardTitle className="text-xl text-zinc-800 pt-2">
                {popupConfig.title}
              </CardTitle>
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