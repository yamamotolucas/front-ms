'use client';

import { useEffect, useState } from 'react';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Reviews } from '@/components/Reviews';
import { Footer } from '@/components/Footer';

interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
}

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false); 

  useEffect(() => {
    async function fetchServices() {
      try {
        setIsError(false);
        const response = await fetch('http://localhost:8080/booking-ms/v1/barber/services/list');
        if (!response.ok) throw new Error('Falha ao buscar serviços');

        const data = await response.json();
        
        if (!data || data.length === 0) {
          throw new Error('Nenhum serviço disponível');
        }

        setServices(data);
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        setIsError(true); 
        setServices([]); 
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col justify-between">
      <div>
        <Hero />
        <Services services={services} isLoading={isLoading} isError={isError} />
        <Reviews />
      </div>
      <Footer />
    </div>
  );
}