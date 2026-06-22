'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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

interface DashboardColumnProps {
  title: string;
  scope: 'UPCOMING' | 'PAST';
  indicatorColor: string;
  showCancelButton?: boolean;
  onActionSuccess?: () => void;
  cancellingId: string | null;
  onCancelTrigger: (app: Appointment) => void;
}

export function DashboardColumn({ 
  title, 
  scope, 
  indicatorColor, 
  showCancelButton = false, 
  cancellingId,
  onCancelTrigger 
}: DashboardColumnProps) {
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    async function fetchColumnData() {
      setIsLoading(true);
      try {
        let url = `http://localhost:8080/booking-ms/v1/bookings/myBookings?scope=${scope}&page=${page}&size=5`;
        if (selectedStatus) {
          url += `&statuses=${selectedStatus}`;
        } else {
          if(scope === 'UPCOMING') {
            url += `&statuses=PENDING,CONFIRMED`;
          }
        }

        console.log(url)
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Erro ao carregar dados da coluna');
        
        const data = await response.json();
        
        setAppointments(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        console.error(`Erro na coluna ${scope}:`, error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchColumnData();
  }, [scope, page, selectedStatus]);

  const formatDateTimeBR = (isoString: string) => {
    const cleanIso = isoString.includes('Z') || (isoString.includes('-') && isoString.length > 19)
      ? new Date(isoString)
      : new Date(isoString.replace('Z', ''));

    const dateStr = cleanIso.toLocaleDateString('pt-BR');
    const timeStr = cleanIso.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return { dateStr, timeStr };
  };

  return (
    <div className="space-y-6 bg-zinc-50/50 p-4 rounded-xl border border-zinc-200/60">
      
      {/* CABEÇALHO DA COLUNA E FILTROS */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-zinc-200 pb-4">
        <div className="flex items-center gap-2">
          <span className={`flex h-3 w-3 rounded-full ${indicatorColor}`} />
          <h2 className="text-xl font-bold text-zinc-800">{title}</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-200/70 text-zinc-600">
            {totalElements}
          </span>
        </div>

        {/* Seletor de Status Independente */}
        <select
          value={selectedStatus}
          onChange={(e) => { setSelectedStatus(e.target.value); setPage(0); }}
          className="sm:ml-auto text-xs bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 font-medium text-zinc-700 cursor-pointer outline-hidden focus:border-amber-500"
        >
          <option value="">Todos os Status</option>
          {scope === 'UPCOMING' ? (
            <>
              <option value="PENDING">Pendentes</option>
              <option value="CONFIRMED">Confirmados</option>
            </>
          ) : (
            <>
              <option value="COMPLETED">Concluídos</option>
              <option value="CONFIRMED">Confirmados</option>
              <option value="PENDING">Pendentes</option>
              <option value="REJECTED">Rejeitados</option>
              <option value="CANCELLED">Cancelados</option>
            </>
          )}
        </select>
      </div>

      {/* LISTAGEM DOS CARDS */}
      <div className="space-y-4 min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-amber-600" />
          </div>
        ) : appointments.length === 0 ? (
          <Card className="border-dashed border-zinc-200 bg-white">
            <CardContent className="p-8 text-center text-zinc-400 italic text-sm">
              Nenhum agendamento encontrado.
            </CardContent>
          </Card>
        ) : (
          appointments.map((app) => {
            const { dateStr, timeStr } = formatDateTimeBR(app.startTime);

            let tooltipMessage = "";
            if (app.bookingStatus === 'PENDING') {
              tooltipMessage = "Para confirmar o agendamento, verifique seu e-mail e clique no link recebido.";
            } else if (app.bookingStatus === 'CONFIRMED') {
              tooltipMessage = "Seu agendamento está confirmado! Tolerância de até 10 minutos de atraso.";
            } else if (app.bookingStatus === 'CANCELLED') {
              tooltipMessage = "Este agendamento foi cancelado.";
            } else if (app.bookingStatus === 'COMPLETED') {
              tooltipMessage = "Este agendamento já foi concluído.";
            }

            const parseToLocalDate = (isoStr: string) => {
              const [datePart, timePart] = isoStr.split('T');
              if (!timePart) return new Date(isoStr).getTime();
              
              const [year, month, day] = datePart.split('-').map(Number);
              const [hour, minute] = timePart.split(':').map(Number);
              
              return new Date(year, month - 1, day, hour, minute).getTime();
            };

            const appointmentTime = parseToLocalDate(app.startTime);
            const now = new Date().getTime();
            const tenMinutesInMs = 10 * 60 * 1000;

            // Define se está atrasado mais de 10 minutos (Apenas para a coluna UPCOMING e agendamentos em aberto)
            const isDelayed = scope === 'UPCOMING' && 
                              (now - appointmentTime) > tenMinutesInMs && 
                              (app.bookingStatus === 'PENDING' || app.bookingStatus === 'CONFIRMED');

            return (
              <Card key={app.bookingId} className={`border-zinc-200 bg-white shadow-xs transition-all ${scope === 'PAST' ? 'opacity-85' : 'hover:border-zinc-300'}`}>
                <CardContent className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      
                      {/* BADGE HORÁRIO PADRONIZADO */}
                      <span className={`text-sm font-bold px-2.5 py-0.5 rounded-lg border transition-colors ${
                        isDelayed
                          ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' 
                          : 'bg-zinc-100 text-zinc-800 border-zinc-200'
                      }`}>
                        {timeStr}
                      </span>
                      
                      <span className="text-sm font-medium text-zinc-500">{dateStr}</span>
                      
                      {/* Tooltip Customizado */}
                      <div className="relative flex items-center group">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ml-1 transition-all ${
                          app.bookingStatus === 'CONFIRMED' ? 'bg-emerald-600 text-white shadow-xs' :
                          app.bookingStatus === 'CANCELLED' ? 'bg-red-100 text-red-700 border border-red-200' :
                          app.bookingStatus === 'COMPLETED' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          'bg-zinc-200 text-zinc-700 border border-zinc-300'
                        } ${scope === 'UPCOMING' ? 'cursor-pointer' : ''}`}>
                          {app.bookingStatus === 'CONFIRMED' ? 'Confirmado' : 
                           app.bookingStatus === 'CANCELLED' ? 'Cancelado' : 
                           app.bookingStatus === 'COMPLETED' ? 'Concluído' : 'Pendente'}
                        </span>
                        
                        {scope === 'UPCOMING' && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-zinc-900 text-white text-xs rounded-lg p-2.5 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-xl z-10 text-center leading-normal">
                            {tooltipMessage}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <h4 className="font-bold text-zinc-800 text-base">Barbeiro ID: {app.barberId}</h4>
                    <p className="text-xs text-zinc-500">
                      <span className="font-medium text-zinc-400">Serviços:</span> {app.services.map(s => s.name).join(', ')}
                    </p>
                    <p className="text-sm font-bold text-amber-600">
                        R$ {app.services.reduce((acc, c) => acc + c.price, 0).toFixed(2)}
                    </p>
                  </div>

                  {showCancelButton && app.bookingStatus !== 'CANCELLED' && (
                    <Button
                      onClick={() => onCancelTrigger(app)}
                      isLoading={cancellingId === app.startTime}
                      className="bg-transparent text-zinc-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-semibold py-2 px-3.5 rounded-lg border border-zinc-200 self-start sm:self-center transition-all cursor-pointer"
                    >
                      Cancelar
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* CONTROLE DE PAGINAÇÃO INDEPENDENTE */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4 border-t border-zinc-200">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 0 || isLoading}
            onClick={() => setPage(p => p - 1)}
            className="text-xs px-3 py-1 cursor-pointer bg-white"
          >
            Anterior
          </Button>
          <span className="text-xs font-medium text-zinc-500">
            Página {page + 1} de {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages - 1 || isLoading}
            onClick={() => setPage(p => p + 1)}
            className="text-xs px-3 py-1 cursor-pointer bg-white"
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}