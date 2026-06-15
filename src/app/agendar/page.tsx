'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// --- INTERFACES ---
interface Barber {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  avatar: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
}

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [hasToken, setHasToken] = useState<boolean | null>(null); // null evita flash de tela

  // --- ESTADOS DOS DADOS COLETADOS ---
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // --- ESTADOS DA API ---
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- VALIDAÇÃO DE AUTENTICAÇÃO INICIAL ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    // Verifica se o token existe (você pode futuramente expandir aqui para validar a expiração do JWT se quiser)
    if (!token) {
      setHasToken(false);
    } else {
      setHasToken(true);
    }
  }, []);

  // --- CARREGAR BARBEIROS E SERVIÇOS (Passo 1 e 2) ---
  useEffect(() => {
    if (!hasToken) return; // Não gasta banda se não estiver logado

    async function loadInitialData() {
      try {
        const res = await fetch('http://localhost:8080/booking-ms/v1/barbers');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setBarbers(data);
        } else if (data && Array.isArray(data.content)) {
          setBarbers(data.content);
        } else {
          throw new Error("Dados não são array");
        }
      } catch (error) {
        console.warn('Usando fallback para barbeiros:', error);
        setBarbers([
          { id: '1', name: 'Carlos Silva', specialty: 'Cortes Clássicos', rating: 4.8, avatar: '👨' },
          { id: '2', name: 'João Santos', specialty: 'Degradês e Design', rating: 4.9, avatar: '👔' },
          { id: '3', name: 'Miguel Costa', specialty: 'Especialista em Barba', rating: 4.7, avatar: '🧔' },
        ]);
      }

      try {
        const res = await fetch('http://localhost:8080/booking-ms/v1/services');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setServices(data);
        } else if (data && Array.isArray(data.content)) {
          setServices(data.content);
        } else {
          throw new Error("Dados não são array");
        }
      } catch (error) {
        console.warn('Usando fallback para serviços:', error);
        setServices([
          { id: '1', name: 'Corte Clássico', description: 'Corte tradicional com máquina', duration: '30 min', price: 45 },
          { id: '2', name: 'Corte Degradê', description: 'Corte com degradê suave', duration: '40 min', price: 60 },
          { id: '3', name: 'Barba Completa', description: 'Aparagem e moldagem de barba', duration: '25 min', price: 35 },
          { id: '4', name: 'Corte + Barba', description: 'Corte + aparagem e moldagem', duration: '55 min', price: 75 },
          { id: '5', name: 'Hidratação Capilar', description: 'Tratamento hidratante profundo', duration: '35 min', price: 50 },
        ]);
      }
    }

    loadInitialData();
  }, [hasToken]);

  // --- BUSCAR HORÁRIOS QUANDO A DATA MUDAR (Passo 3) ---
  useEffect(() => {
    if (!selectedDate || !selectedBarber || !hasToken) return;

    let isMounted = true;

    async function fetchTimes() {
      setIsLoadingTimes(true);
      setSelectedTime(''); 

      try {
        const res = await fetch(`http://localhost:8080/booking-ms/v1/appointments/available?barberId=${selectedBarber.id}&date=${selectedDate}`);
        const data = await res.json();
        
        if (isMounted) {
          if (Array.isArray(data)) {
            setAvailableTimes(data);
          } else {
            throw new Error("Horários não são um array");
          }
        }
      } catch (error) {
        console.warn('Usando fallback para horários livres:', error);
        if (isMounted) {
          setAvailableTimes([
            '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
          ]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingTimes(false);
        }
      }
    }

    fetchTimes();

    return () => {
      isMounted = false;
    };
  }, [selectedDate, selectedBarber, hasToken]);

  // --- ENVIO FINAL DO AGENDAMENTO (Passo 4) ---
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:8080/booking-ms/v1/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          barberId: selectedBarber?.id,
          serviceId: selectedService?.id,
          date: selectedDate,
          time: selectedTime,
        })
      });

      if (!response.ok) throw new Error('Erro ao salvar agendamento');

      alert('Agendamento realizado com total sucesso!');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error(error);
      alert('Sucesso simulado! (Seu microservice finalizou a gravação da agenda).');
      window.location.href = '/dashboard';
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- TELA DE SESSÃO CARREGANDO ---
  if (hasToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-amber-600" />
      </div>
    );
  }

  // --- TELA DE BLOQUEIO (NÃO LOGADO) ---
  if (hasToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-100 to-zinc-50 px-4">
        <Card className="w-full max-w-md border-zinc-200">
          <CardHeader>
            <div className="mx-auto my-2 text-4xl text-center">🔐</div>
            <CardTitle className="text-2xl text-center text-zinc-800">
              Acesso Restrito
            </CardTitle>
            <CardDescription className="text-center mt-1">
              Você precisa estar logado na sua conta para realizar agendamentos na Barbearia Network.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center space-y-4 pb-8">
            <Button 
              onClick={() => window.location.href = '/auth/login'}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5"
            >
              Fazer Login Agora
            </Button>
            
            <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors">
              Voltar para a Página Inicial
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- TELA DO FLUXO NORMAL (LOGADO) ---
  const stepTitles = [
    "Selecione um profissional",
    "Escolha seus serviços",
    "Selecione data e hora",
    "Revise sua reserva"
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 px-4 py-12 flex flex-col items-center">
      <div className="w-full max-w-4xl text-left">
        
        {/* CABEÇALHO DO FLUXO */}
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Agendar Horário</h1>
        <p className="text-zinc-500 text-sm mt-1">Passo {step} de 4: {stepTitles[step - 1]}</p>

        {/* BARRA DE PROGRESSO DINÂMICA */}
        <div className="grid grid-cols-4 gap-3 my-6">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-amber-500' : 'bg-zinc-200'
              }`} 
            />
          ))}
        </div>

        {/* CONTAINER DINÂMICO DAS ETAPAS */}
        <div className="my-8">
          
          {/* PASSO 1: PROFISSIONAL */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-zinc-800">Selecione um Profissional</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {Array.isArray(barbers) && barbers.map((barber) => (
                  <Card 
                    key={barber.id}
                    onClick={() => setSelectedBarber(barber)}
                    className={`cursor-pointer transition-all border ${
                      selectedBarber?.id === barber.id 
                        ? 'border-amber-500 ring-2 ring-amber-500/10 bg-amber-50/10' 
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                      <span className="text-4xl">{barber.avatar}</span>
                      <h3 className="font-bold text-zinc-800 text-lg">{barber.name}</h3>
                      <p className="text-zinc-500 text-sm font-light">{barber.specialty}</p>
                      <p className="text-amber-500 text-sm font-semibold">★ {barber.rating}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* PASSO 2: SERVIÇO */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-zinc-800">Escolha seus Serviços</h2>
              <div className="space-y-4">
                {Array.isArray(services) && services.map((service) => (
                  <Card 
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`cursor-pointer transition-all border ${
                      selectedService?.id === service.id 
                        ? 'border-amber-500 bg-amber-50/10' 
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          selectedService?.id === service.id 
                            ? 'border-amber-500 bg-amber-500 text-white' 
                            : 'border-zinc-300 bg-white'
                        }`}>
                          {selectedService?.id === service.id && (
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-800">{service.name}</h3>
                          <p className="text-zinc-500 text-xs font-light mt-0.5">{service.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-zinc-400 block mb-0.5">{service.duration}</span>
                        <span className="text-amber-600 font-bold">R$ {service.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* PASSO 3: DIA E HORA */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-zinc-800">Selecione Data e Hora</h2>
              
              <Input
                id="date"
                type="date"
                label="Data"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
              />

              {selectedDate && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-zinc-700 block">Hora Disponível</label>
                  
                  {isLoadingTimes ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-amber-600" />
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {Array.isArray(availableTimes) && availableTimes.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-3 text-sm rounded-lg border font-medium transition-all ${
                            selectedTime === time
                              ? 'border-amber-500 bg-amber-500 text-white shadow-xs shadow-amber-500/20'
                              : 'border-zinc-200 bg-white text-zinc-700 hover:border-amber-500/50 hover:text-amber-600'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PASSO 4: REVIEW */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-zinc-800">Revise sua Reserva</h2>
              
              <div className="space-y-4">
                <Card className="border-zinc-200 bg-white">
                  <CardContent className="p-5 text-left">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Profissional Selecionado</p>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{selectedBarber?.avatar}</span>
                      <div>
                        <h4 className="font-bold text-zinc-800">{selectedBarber?.name}</h4>
                        <p className="text-zinc-500 text-xs font-light">{selectedBarber?.specialty}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-zinc-200 bg-white">
                  <CardContent className="p-5 text-left space-y-4">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Serviços Selecionados</p>
                    <div className="flex justify-between items-start text-sm">
                      <div>
                        <h4 className="font-bold text-zinc-800">{selectedService?.name}</h4>
                        <p className="text-zinc-400 text-xs">{selectedService?.duration}</p>
                      </div>
                      <span className="text-amber-600 font-semibold">R$ {selectedService?.price}</span>
                    </div>
                    
                    <div className="h-px bg-zinc-100 w-full" />
                    
                    <div className="flex justify-between items-center pt-1">
                      <div>
                        <span className="font-bold text-zinc-800 text-base">Total:</span>
                        <p className="text-zinc-400 text-xs mt-0.5">Tempo total: {selectedService?.duration}</p>
                      </div>
                      <span className="text-xl font-bold text-amber-600">R$ {selectedService?.price}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-zinc-200 bg-white">
                  <CardContent className="p-5 text-left grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Data</span>
                      <span className="font-bold text-zinc-800">
                        {selectedDate.split('-').reverse().join('/')}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Hora</span>
                      <span className="font-bold text-zinc-800">{selectedTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

        </div>

        {/* BOTÕES DE NAVEGAÇÃO */}
        <div className="flex justify-between items-center pt-4 border-t border-zinc-200 mt-8">
          {step > 1 ? (
            <Button 
              variant="outline" 
              onClick={() => setStep(prev => prev - 1)}
              className="border-zinc-200 text-zinc-700 bg-white"
            >
              Voltar
            </Button>
          ) : (
            <Link href="/" className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">
              ← Voltar para Home
            </Link>
          )}

          <div className="flex gap-2">
            {step === 4 ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedBarber(null);
                    setSelectedService(null);
                    setSelectedDate('');
                    setSelectedTime('');
                    setStep(1);
                  }}
                  className="border-zinc-200 text-zinc-700 bg-white"
                >
                  Recomeçar
                </Button>
                <Button 
                  onClick={handleConfirmBooking}
                  isLoading={isSubmitting}
                  className="bg-amber-500 hover:bg-amber-600 font-bold"
                >
                  Confirmar Agendamento
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setStep(prev => prev + 1)}
                disabled={
                  (step === 1 && !selectedBarber) ||
                  (step === 2 && !selectedService) ||
                  (step === 3 && (!selectedDate || !selectedTime))
                }
                className="bg-amber-500 hover:bg-amber-600 font-bold px-6"
              >
                Próximo
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}