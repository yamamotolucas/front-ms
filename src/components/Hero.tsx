'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Hero() {
  const [isBarber, setIsBarber] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    setIsBarber(role === 'BARBER');
  }, []);

  const buttonHref = isBarber ? '/agenda' : '/agendar';
  const buttonText = isBarber ? 'Minha Agenda' : 'Agendar Horário';

  return (
    <section className="bg-[#1c1c1e] text-white py-20 text-center px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Bem-vindo à Barbearia Network
        </h1>
        <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto font-light">
          Agende seu horário com os melhores profissionais da região. Qualidade e estilo garantidos.
        </p>
        <div className="pt-4">
          <Link href={buttonHref}>
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3">
              {buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}