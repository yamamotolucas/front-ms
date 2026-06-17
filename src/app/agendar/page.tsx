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

interface PopupConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error';
  onConfirm?: () => void;
}

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [hasToken, setHasToken] = useState<boolean | null>(null); 

  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState(''); 
  const [selectedTime, setSelectedTime] = useState('');

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isApiError, setIsApiError] = useState(false);
  const [dateErrorMessage, setDateErrorMessage] = useState<string | null>(null);

  const [popupConfig, setPopupConfig] = useState<PopupConfig>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  const showPopup = (title: string, message: string, type: 'success' | 'error', onConfirm?: () => void) => {
    setPopupConfig({ isOpen: true, title, message, type, onConfirm });
  };

  // --- VALIDAÇÃO DE AUTENTICAÇÃO INICIAL ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setHasToken(false);
    } else {
      setHasToken(true);
    }
  }, []);

  // --- CARREGAR BARBEIROS E SERVIÇOS (Passo 1 e 2) ---
  useEffect(() => {
    if (!hasToken) return; 

    async function loadInitialData() {
      try {
        setIsApiError(false);
     
        const resBarbers = await fetch('http://localhost:8080/identity-ms/v1/barber');
        if (!resBarbers.ok) throw new Error("Erro ao buscar barbeiros");
        const dataBarbers = await resBarbers.json();
        
        const resServices = await fetch('http://localhost:8080/booking-ms/v1/barber/services/list');
        if (!resServices.ok) throw new Error("Erro ao buscar serviços");
        const dataServices = await resServices.json();

        if (Array.isArray(dataBarbers)) {
          setBarbers(dataBarbers);
        } else if (dataBarbers && Array.isArray(dataBarbers.content)) {
          setBarbers(dataBarbers.content);
        } else {
          throw new Error("Formato de barbeiros inválido");
        }

        if (Array.isArray(dataServices)) {
          setServices(dataServices);
        } else if (dataServices && Array.isArray(dataServices.content)) {
          setServices(dataServices.content);
        } else {
          throw new Error("Formato de serviços inválido");
        }

      } catch (error) {
        console.error('Erro crítico na inicialização do agendamento:', error);
        setIsApiError(true);
        setBarbers([]);
        setServices([]);
      }
    }

    loadInitialData();
  }, [hasToken]);

  // --- BUSCAR HORÁRIOS QUANDO A DATA MUDAR (Passo 3) ---
  useEffect(() => {
    if (!selectedDate || !selectedBarber || !selectedService || !hasToken) return;

    let isMounted = true;

    async function fetchTimes() {
      setIsLoadingTimes(true);
      setSelectedTime(''); 
      setDateErrorMessage(null); 

      try {
        const token = localStorage.getItem('token');

        const res = await fetch('http://localhost:8080/booking-ms/v1/bookings/availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            barberId: selectedBarber?.id,
            services: [selectedService?.id],
            requestedDate: selectedDate 
          })
        });
  
        if (!res.ok) {
          const errorData = await res.text();
       
          if (isMounted) {
            setAvailableTimes([]);
            if (errorData.includes("Bookings can only be made on business days.")) {
              setDateErrorMessage("Os agendamentos só podem ser realizados em dias de funcionamento (terça a sábado).");
            } else {
              setDateErrorMessage("Não foi possível carregar os horários para esta data.");
            }
          }
          return;
        }
        
        const data = await res.json();
        
        if (isMounted) {
          if (Array.isArray(data)) {
            setAvailableTimes(data);
          } else {
            throw new Error("Horários não retornaram um array válido");
          }
        }
      } catch (error) {
        console.error('Erro ao buscar horários', error);
        if (isMounted) {
          setAvailableTimes([]);
          setDateErrorMessage('Erro ao buscar os horários disponíveis.');
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
  }, [selectedDate, selectedBarber, selectedService, hasToken]);

  // --- ENVIO FINAL DO AGENDAMENTO (Passo 4) ---
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    
    try {
      if (!selectedTime) {
        showPopup('Aviso', 'Por favor, selecione um horário antes de confirmar.', 'error');
        setIsSubmitting(false);
        return;
      }

      const [datePart, timePart] = selectedTime.split(' ');
      const [day, month, year] = datePart.split('-');
      const formattedDateTime = `${year}-${month}-${day}T${timePart}`;

      const response = await fetch('http://localhost:8080/booking-ms/v1/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          barberId: selectedBarber?.id,
          services: [selectedService?.id],
          startTime: formattedDateTime 
        })
      });

      if (!response.ok) {
        
        let backendMessage = "";
        try {
          const errorData = await response.clone().json();
          backendMessage = errorData.message || errorData.error || "";
        } catch {
          backendMessage = await response.text();
        }

        if (backendMessage.includes("Customer already has a booking scheduled for this date.")) {
          showPopup('Agendamento Recusado', 'Ops! Você já possui um agendamento marcado para esta mesma data.', 'error');
        } else {
          showPopup('Erro no Agendamento', backendMessage || 'Não foi possível concluir seu agendamento.', 'error');
        }
        return; 
      }

      showPopup('Sucesso!', 'Agendamento realizado com sucesso!', 'success', () => {
        window.location.href = '/dashboard';
      });

    } catch (error) {
      console.error('Erro na requisição de agendamento:', error);
      showPopup('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão.', 'error');
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-100 to-zinc-50 px-4">
        <Card className="w-full max-w-md border-zinc-200">
          <CardHeader>
            <div className="mx-auto my-2 text-4xl text-center">🔐</div>
            <CardTitle className="text-2xl text-center text-zinc-800">Acesso Restrito</CardTitle>
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

  const stepTitles = [
    "Selecione um profissional",
    "Escolha seus serviços",
    "Selecione data e hora",
    "Revise sua reserva"
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 px-4 py-12 flex flex-col items-center relative">
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
          
          {/* TELA DE ERRO SE A API FALHAR TOTALMENTE */}
          {isApiError ? (
            <div className="w-full flex flex-col items-center justify-center py-16 px-4 rounded-xl border border-dashed border-zinc-200 bg-white text-center space-y-3">
              <span className="text-4xl">⚠️</span>
              <h3 className="text-lg font-bold text-zinc-800">Falha ao carregar dados</h3>
              <p className="text-sm text-zinc-500 max-w-sm">
                Não conseguimos estabelecer comunicação com os serviços de agendamento. Por favor, verifique sua conexão ou tente novamente mais tarde.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="mt-2 bg-zinc-900 text-white hover:bg-zinc-800"
              >
                Atualizar Página
              </Button>
            </div>
          ) : (
            <>
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

                  {dateErrorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium animate-in fade-in duration-200">
                      🚫 {dateErrorMessage}
                    </div>
                  )}

                  {selectedDate && !dateErrorMessage && (
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-zinc-700 block">Hora Disponível</label>
                      
                      {isLoadingTimes ? (
                        <div className="h-6 w-6 animate-spin rounded-full border-4 border-zinc-300 border-t-amber-600" />
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                          {Array.isArray(availableTimes) && availableTimes.length > 0 ? (
                            availableTimes.map((timeString) => {
                              const onlyTime = timeString.split(' ')[1]?.substring(0, 5) || timeString;

                              return (
                                <button
                                  key={timeString}
                                  type="button"
                                  onClick={() => setSelectedTime(timeString)}
                                  className={`py-2 px-3 text-sm rounded-lg border font-medium transition-all ${
                                    selectedTime === timeString
                                      ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-amber-500/50 hover:text-amber-600'
                                  }`}
                                >
                                  {onlyTime}
                                </button>
                              );
                            })
                          ) : (
                            <p className="text-sm text-zinc-500 col-span-full italic">Nenhum horário disponível para a data selecionada.</p>
                          )}
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
                          <span className="font-bold text-zinc-800">
                            {selectedTime.split(' ')[1]?.substring(0, 5) || selectedTime}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* BOTÕES DE NAVEGAÇÃO */}
        <div className="flex justify-between items-center pt-4 border-t border-zinc-200 mt-8">
          {step > 1 ? (
            <Button 
              variant="outline" 
              onClick={() => setStep(prev => prev - 1)}
              className="border-zinc-200 text-zinc-700 bg-white"
              disabled={isApiError}
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
                  isApiError ||
                  !!dateErrorMessage || 
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

      {/* --- POP-UP MODAL CUSTOMIZADO (Sobreposição Fixa) --- */}
      {popupConfig.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm border-none shadow-2xl bg-white text-center p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <CardHeader className="p-0">
              <div className="mx-auto my-1 text-4xl text-center">
                {popupConfig.type === 'success' ? '✅' : '❌'}
              </div>
              <CardTitle className="text-xl text-zinc-800 pt-2">
                {popupConfig.title}
              </CardTitle>
              <CardDescription className="text-zinc-500 text-sm font-normal mt-1.5 leading-relaxed">
                {popupConfig.message}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 pt-2">
              <Button
                type="button"
                onClick={() => {
                  setPopupConfig(prev => ({ ...prev, isOpen: false }));
                  if (popupConfig.onConfirm) popupConfig.onConfirm();
                }}
                className={`w-full text-white text-sm py-2 font-medium ${
                  popupConfig.type === 'success' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-zinc-900 hover:bg-zinc-800'
                }`}
              >
                OK
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}