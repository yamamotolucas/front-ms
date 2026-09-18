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

const INSTITUTIONAL_PILLARS = [
  {
    id: 'pillar-1',
    icon: '✂️',
    title: 'Cortes & Visagismo',
    description: 'Análise do formato do rosto e estilo pessoal para um acabamento preciso, do clássico ao moderno.',
    badge: 'Técnica & Precisão',
  },
  {
    id: 'pillar-2',
    icon: '💈',
    title: 'Barboterapia & Cuidados',
    description: 'Processo completo com toalha quente, hidratação profunda, óleos essenciais e navalha descartável.',
    badge: 'Relaxamento',
  },
  {
    id: 'pillar-3',
    icon: '✨',
    title: 'Produtos de Linha Premium',
    description: 'Uso exclusivo de cosméticos de alta performance para modelagem, saúde capilar e alinhamento.',
    badge: 'Qualidade',
  },
];

export function Services({ services, isLoading, isError }: ServicesProps) {
  const hasRealServices = Array.isArray(services) && services.length > 0;
  const showInstitutional = !isLoading && (isError || !hasRealServices);

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="mb-10 text-left">
        <h2 className="text-3xl font-bold text-zinc-800">
          {showInstitutional ? 'Nossa Experiência' : 'Nossos Serviços'}
        </h2>
        <p className="text-zinc-500 text-sm mt-1">
          {showInstitutional
            ? 'Conheça o padrão de atendimento e cuidado que você encontra em nossa barbearia'
            : 'Conheça todos os serviços que oferecemos para você'}
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-amber-600" />
        </div>
      )}

      {/* CASO 1: Serviços reais carregados do backend */}
      {!isLoading && !showInstitutional && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              className="hover:shadow-xs transition-shadow duration-200 border border-zinc-100 rounded-xl bg-white"
            >
              <CardContent className="p-6 flex flex-col justify-between text-left h-full">
                <div className="space-y-1 mb-6">
                  <h3 className="text-[1.15rem] font-bold text-zinc-900 tracking-tight">
                    {service.name}
                  </h3>
                  <p className="text-zinc-500 text-sm font-normal leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="w-full h-px bg-zinc-100 mb-4" />

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

      {/* CASO 2: Fallback institucional (backend fora ou lista vazia) */}
      {!isLoading && showInstitutional && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INSTITUTIONAL_PILLARS.map((pillar) => (
            <Card
              key={pillar.id}
              className="border border-zinc-200/80 rounded-xl bg-white hover:border-zinc-300 transition-colors duration-200 shadow-xs"
            >
              <CardContent className="p-6 flex flex-col justify-between text-left h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl p-2 bg-zinc-50 rounded-lg border border-zinc-100 inline-block">
                      {pillar.icon}
                    </span>
                    <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-[1.15rem] font-bold text-zinc-900 tracking-tight mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-zinc-500 text-sm font-normal leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100">
                  <p className="text-xs text-zinc-400">
                    Consulte os valores e disponibilidade diretamente no agendamento.
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