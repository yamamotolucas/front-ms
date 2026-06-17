'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { mockReviews, Review } from '@/data/reviewsData'; // Ajuste o caminho da importação aqui

export function Reviews() {
  const [selectedReviews, setSelectedReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Sorteia e seleciona 6 avaliações aleatórias sem repetição
    const shuffled = [...mockReviews]
      .sort(() => 0.5 - Math.random()) // Embaralha o array de forma randômica
      .slice(0, 6);                    // Extrai exatamente 6 elementos

    setSelectedReviews(shuffled);
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 border-t border-zinc-200/60">
      <div className="mb-10 text-left">
        <h2 className="text-3xl font-bold text-zinc-800">Quem já passou por aqui</h2>
        <p className="text-zinc-500 text-sm mt-1">
          Veja os relatos e avaliações dos nossos clientes satisfeitos
        </p>
      </div>

      {/* Grid ajustado de 3 para 2 colunas em telas médias para acomodar melhor os 6 itens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedReviews.map((review) => (
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