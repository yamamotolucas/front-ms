'use client';

import { Card, CardContent } from '@/components/ui/Card';

interface Review {
  id: string;
  name: string;
  avatar: string;
  stars: number;
  comment: string;
  date: string;
}

export function Reviews() {
  const reviews: Review[] = [
    {
      id: '1',
      name: 'Lucas Almeida',
      avatar: '👨‍💻',
      stars: 5,
      comment: 'Ambiente sensacional e profissionais extremamente qualificados. O corte degradê com o João Santos ficou impecável!',
      date: 'Há 2 dias'
    },
    {
      id: '2',
      name: 'Bruno Silva',
      avatar: '🏃‍♂️',
      stars: 5,
      comment: 'Melhor barbearia da região sem dúvidas. O sistema de agendamento pelo site facilita demais a vida, nunca peguei fila.',
      date: 'Há 1 semana'
    },
    {
      id: '3',
      name: 'Rafael Costa',
      avatar: '🧑‍💼',
      stars: 4,
      comment: 'Atendimento nota 10 e café de primeira. Fiz a barba completa e o cuidado com a toalha quente faz toda a diferença.',
      date: 'Há 2 semanas'
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 border-t border-zinc-200/60">
      <div className="mb-10 text-left">
        <h2 className="text-3xl font-bold text-zinc-800">Quem já passou por aqui</h2>
        <p className="text-zinc-500 text-sm mt-1">
          Veja os relatos e avaliações dos nossos clientes satisfeitos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <Card key={review.id} className="border border-zinc-100 rounded-xl bg-white shadow-xs">
            <CardContent className="p-6 flex flex-col justify-between text-left h-full space-y-4">
              
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-zinc-100 rounded-lg">{review.avatar}</span>
                <div>
                  <h4 className="font-bold text-zinc-800 text-sm">{review.name}</h4>
                  <span className="text-[11px] text-zinc-400">{review.date}</span>
                </div>
              </div>

              <div className="text-amber-500 text-xs font-semibold tracking-wider">
                {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
              </div>

              <p className="text-zinc-600 text-sm font-normal leading-relaxed italic">
                "{review.comment}"
              </p>

            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}