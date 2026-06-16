'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmationPassword: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmationPassword?: string;
  }>({});
  
  const [isLoading, setIsLoading] = useState(false);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!showSuccessModal) return;

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redireciona de fato após 3 segundos
    const timeout = setTimeout(() => {
      window.location.href = '/auth/login';
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [showSuccessModal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome completo é obrigatório';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmationPassword) {
      newErrors.confirmationPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmationPassword) {
      newErrors.confirmationPassword = 'As senhas não coincidem';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/identity-ms/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmationPassword: formData.confirmationPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Erro: ${data.error || 'Falha ao registrar conta.'}`);
        return;
      }

      // Em vez do antigo alert, ativamos o modal visual
      setShowSuccessModal(true);

    } catch (error: unknown) {
      console.error('Erro na requisição:', (error as Error).message);
      alert('Ocorreu um erro ao tentar criar sua conta. Por favor, tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-100 to-zinc-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Criar Conta na Barbearia Network</CardTitle>
          <CardDescription className="text-center">
            Preencha os campos abaixo para se cadastrar
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              name="name"
              type="text"
              label="Nome Completo"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Seu nome e sobrenome"
              error={errors.name}
              required
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
              error={errors.email}
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Senha"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Mínimo 6 caracteres"
              error={errors.password}
              required
            />

            <Input
              id="confirmationPassword"
              name="confirmationPassword"
              type="password"
              label="Confirmar Senha"
              value={formData.confirmationPassword}
              onChange={handleInputChange}
              placeholder="Repita sua senha"
              error={errors.confirmationPassword}
              required
            />

            <Button type="submit" size="lg" className="w-full mt-2" isLoading={isLoading}>
              Registrar Conta
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-300" />
            <span className="text-sm text-zinc-600">ou</span>
            <div className="flex-1 h-px bg-zinc-300" />
          </div>

          {/* Google Login / Registro alternativo */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => alert('Google register - Em desenvolvimento')}
          >
            🔵 Cadastrar com Google
          </Button>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-600">
              Já tem uma conta?{' '}
              <Link href="/auth/login" className="text-amber-600 hover:text-amber-700 font-semibold">
                Faça login aqui
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* MODAL DE CONFIRMAÇÃO VISUAL (SOBREPOSIÇÃO) */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm border-none shadow-2xl bg-white text-center p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <CardHeader className="p-0">
              <div className="mx-auto my-2 text-4xl text-center animate-bounce">🎉</div>
              <CardTitle className="text-2xl text-zinc-800">
                Conta Criada!
              </CardTitle>
              <CardDescription className="text-zinc-500 mt-1">
                Seu cadastro na Barbearia Network foi concluído com sucesso.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 flex flex-col items-center justify-center space-y-4">
              <div className="h-7 w-7 animate-spin rounded-full border-4 border-zinc-200 border-t-amber-600" />
              
              <p className="text-sm text-zinc-500">
                Redirecionando para o login em{' '}
                <span className="font-bold text-amber-600 text-lg">{countdown}</span>{' '}
                {countdown === 1 ? 'segundo' : 'segundos'}...
              </p>

              <Button
                onClick={() => window.location.href = '/auth/login'}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs py-2 font-medium"
              >
                Ir para o Login agora
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}