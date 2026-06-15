'use client';

import { Card, CardContent } from '@/components/ui/Card';

interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}

interface ServicesProps {
  services: Service[];
  isLoading: boolean;
  isError: boolean;
}

export function Services({ services, isLoading, isError }: ServicesProps) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="mb-10 text-left">
        <h2 className="text-3xl font-bold text-zinc-800">Nossos Serviços</h2>
        <p className="text-zinc-500 text-sm mt-1">Conheça todos os serviços que oferecemos para você</p>
      </div>

      {/* 1. SE ESTIVER CARREGANDO */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-amber-600" />
        </div>
      )}

      {/* 2. SE HOUVER ERRO OU TIVER VINDO VAZIO */}
      {!isLoading && isError && (
        <div className="w-full flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-zinc-200 bg-white text-center space-y-3">
          <span className="text-3xl">⚠️</span>
          <h3 className="text-base font-semibold text-zinc-800">Falha ao carregar serviços</h3>
          <p className="text-sm text-zinc-500 max-w-xs">
            Não foi possível estabelecer conexão com o servidor. Por favor, tente atualizar a página em instantes.
          </p>
        </div>
      )}

      {/* 3. SE TUDO ESTIVER OK, RENDERIZA OS CARDS COMPLETOS */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(services) && services.map((service) => (
            <Card key={service.id} className="hover:shadow-xs transition-shadow duration-200 border border-zinc-100 rounded-xl bg-white">
              <CardContent className="p-6 flex flex-col justify-between text-left h-full">
                
                {/* Bloco Superior: Título e Descrição */}
                <div className="space-y-1 mb-6">
                  <h3 className="text-[1.15rem] font-bold text-zinc-900 tracking-tight">
                    {service.name}
                  </h3>
                  <p className="text-zinc-500 text-sm font-normal leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Linha Divisória Fina */}
                <div className="w-full h-px bg-zinc-100 mb-4" />

                {/* Bloco Inferior: Duração e Preço */}
                <div className="space-y-1.5">
                  <p className="text-xs text-zinc-400 font-normal">
                    Duração: <span className="text-zinc-600 font-medium">{service.durationMinutes} minutos</span>
                  </p>
                  <p className="text-lg font-bold text-amber-600 tracking-wide">
                    R$ {service.price}
                  </p>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}