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
  customerName: string;
  startTime: string;
  endTime: string;
  services: Service[];
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';
}

interface BarberDashboardColumnProps {
  title: string;
  scope: 'UPCOMING' | 'PAST';
  indicatorColor: string;
  showCompleteButton?: boolean; 
  completingId: string | null;
  onCompleteTrigger: (app: Appointment) => void;
}

export function BarberDashboardColumn({
  title,
  scope,
  indicatorColor,
  showCompleteButton = false,
  completingId,
  onCompleteTrigger
}: BarberDashboardColumnProps) {

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');

  useEffect(() => {
    async function fetchColumnData() {
      setIsLoading(true);
      try {
        let url = `http://localhost:8080/booking-ms/v1/bookings/myBookings?scope=${scope}&page=${page}&size=5&isBarber=true`;

        // Na fila ativa (UPCOMING) traz APENAS os CONFIRMED de forma fixa.
        // No histórico (PAST) traz apenas os COMPLETED.
        if (scope === 'UPCOMING') {
          url += `&statuses=CONFIRMED`;
        } else {
          url += `&statuses=COMPLETED`;
        }

        if (scope === 'PAST' && selectedPeriod) {
          url += `&lastDays=${selectedPeriod}`;
        }

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Erro ao carregar dados da coluna do barbeiro');

        const data = await response.json();

        setAppointments(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (error) {
        console.error(`Erro na coluna profissional ${scope}:`, error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchColumnData();
  }, [scope, page, selectedPeriod]);

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

      {/* CABEÇALHO DA COLUNA E FILTRO DE PERÍODO */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-zinc-200 pb-4 justify-between">
        <div className="flex items-center gap-2">
          <span className={`flex h-3 w-3 rounded-full ${indicatorColor}`} />
          <h2 className="text-xl font-bold text-zinc-800">{title}</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-200/70 text-zinc-600">
            {totalElements}
          </span>
        </div>

        {scope === 'PAST' && (
          <select
            value={selectedPeriod}
            onChange={(e) => { setSelectedPeriod(e.target.value); setPage(0); }}
            className="text-xs bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 font-medium text-zinc-700 cursor-pointer outline-hidden focus:border-amber-500 w-full sm:w-auto"
          >
            <option value="">Todo o Histórico</option>
            <option value="7">Última Semana</option>
            <option value="15">Últimos 15 dias</option>
            <option value="30">Últimos 30 dias</option>
          </select>
        )}
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
              Nenhum agendamento encontrado nesta coluna.
            </CardContent>
          </Card>
        ) : (
          appointments.map((app) => {
            const { dateStr, timeStr } = formatDateTimeBR(app.startTime);

            return (
              <Card key={app.bookingId} className={`border-zinc-200 bg-white shadow-xs transition-all ${scope === 'PAST' ? 'opacity-85' : 'hover:border-zinc-300'}`}>
                <CardContent className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-zinc-100 text-zinc-800 border border-zinc-200 text-sm font-bold px-2.5 py-0.5 rounded-lg transition-colors">
                        {timeStr}
                      </span>
                      <span className="text-sm font-medium text-zinc-500">{dateStr}</span>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ml-1 transition-all ${app.bookingStatus === 'CONFIRMED' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}>
                        {app.bookingStatus === 'CONFIRMED' ? 'Confirmado' : 'Concluído'}
                      </span>
                    </div>

                    <h4 className="font-bold text-zinc-800 text-base">Cliente: {app.customerName || "Não identificado"}</h4>
                    <p className="text-xs text-zinc-500">
                      <span className="font-medium text-zinc-400">Serviços:</span> {app.services.map(s => s.name).join(', ')}
                    </p>
                    <p className="text-sm font-bold text-amber-600">
                      R$ {app.services.reduce((acc, c) => acc + c.price, 0).toFixed(2)}
                    </p>
                  </div>

                  {/* 🚀 BOTÃO DE CONCLUIR ATENDIMENTO */}
                  {showCompleteButton && app.bookingStatus === 'CONFIRMED' && (
                    <Button
                      onClick={() => onCompleteTrigger(app)}
                      isLoading={completingId === app.startTime}
                      className="bg-white border border-emerald-200 text-zinc-800 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 text-xs font-semibold py-2 px-4 rounded-lg self-start sm:self-center transition-all cursor-pointer shadow-xs"
                    >
                      Concluir Atendimento
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* PAGINAÇÃO */}
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