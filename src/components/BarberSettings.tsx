'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// --- INTERFACES ---
interface BarberProfile {
  specialty: string;
  avatar: string;
}

export function BarberSettings() {
  const [formData, setFormData] = useState<BarberProfile>({
    specialty: '',
    avatar: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchBarberData() {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8080/identity-ms/v1/barber/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Erro ao carregar dados profissionais.');

        const data: BarberProfile = await response.json();
        setFormData({
          specialty: data.specialty || '',
          avatar: data.avatar || ''
        });
      } catch (error) {
        console.error('Erro ao buscar perfil do barbeiro:', error);
        setMessage({ type: 'error', text: 'Não foi possível carregar suas configurações profissionais.' });
      } finally {
        setIsLoading(false);
      }
    }

    fetchBarberData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:8080/identity-ms/v1/barber/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Erro ao atualizar perfil profissional.');
      }

      setMessage({ type: 'success', text: 'Perfil profissional atualizado com sucesso!' });
    } catch (error: any) {
      console.error('Erro ao salvar perfil do barbeiro:', error);
      setMessage({ type: 'error', text: error.message || 'Ocorreu um erro ao salvar as alterações.' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto flex items-center justify-center h-48">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-amber-600" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* SEÇÃO DO CABEÇALHO PROFISSIONAL */}
      <div className="text-left pt-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3">
          Configurações de Barbeiro
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-zinc-200 bg-white shadow-xs">
          <CardContent className="p-6 space-y-5">
            
            {/* FEEDBACK DE SUCESSO OU ERRO */}
            {message && (
              <div className={`p-3.5 text-xs font-semibold rounded-lg border transition-all text-left ${
                message.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}>
                {message.type === 'success' ? '✅ ' : '🚫 '}{message.text}
              </div>
            )}

            {/* GRID DE DUAS COLUNAS: ESPECIALIDADE E EMOJI */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* CAMPO: ESPECIALIDADE (Ocupa 2 colunas no Grid) */}
              <div className="flex flex-col gap-1.5 text-left sm:col-span-2">
                <label htmlFor="specialty" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Sua Especialidade
                </label>
                <input
                  type="text"
                  id="specialty"
                  name="specialty"
                  required
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder="Ex: Visagismo, Degradê, Barba Terapia"
                  className="w-full text-sm bg-white border border-zinc-300 rounded-lg px-3.5 py-2 font-medium text-zinc-800 outline-hidden focus:border-amber-500 transition-colors"
                />
              </div>

              {/* CAMPO: EMOJI ÍCONE (Ocupa 1 coluna no Grid) */}
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="avatar" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Avatar de Perfil
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-lg pointer-events-none select-none">
                    {formData.avatar || '💈'}
                  </span>
                  <input
                    type="text"
                    id="avatar"
                    name="avatar"
                    required
                    maxLength={2} 
                    value={formData.avatar}
                    onChange={handleChange}
                    placeholder="Ex: 💈, ✂️, 🧔"
                    className="w-full text-sm bg-white border border-zinc-300 rounded-lg pl-10 pr-3.5 py-2 font-medium text-zinc-800 outline-hidden focus:border-amber-500 transition-colors text-center"
                  />
                </div>
              </div>

            </div>

          </CardContent>
        </Card>

        {/* BOTÃO DE SALVAR PROFISSIONAL */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            isLoading={isUpdating}
            className="bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all cursor-pointer border-none"
          >
            Atualizar Perfil Profissional
          </Button>
        </div>
      </form>
    </div>
  );
}