'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiError) return;

    const timeout = setTimeout(() => {
      setApiError(null);
    }, 2500);

    return () => clearTimeout(timeout);
  }, [apiError]);

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
    const newErrors: { email?: string; password?: string } = {};

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
      const response = await fetch('http://localhost:8080/identity-ms/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Alimenta o estado com o erro retornado pela API (Ex: "Credenciais inválidas")
        setApiError(data.error || 'Usuário ou senha incorretos.');
        return;
      }

      if (data.token) localStorage.setItem('token', data.token);
      if (data.role) localStorage.setItem('user_role', data.role);

      setFormData({ email: '', password: '' });
      window.location.href = '/';

    } catch (error: unknown) {
      console.error('Erro na requisição:', (error as Error).message);
      setApiError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-100 to-zinc-50 px-4 relative">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Entrar na Barbearia Network</CardTitle>
          <CardDescription className="text-center">
            Faça login com sua conta para continuar
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
              error={errors.password}
              required
            />

            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              Entrar
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-300" />
            <span className="text-sm text-zinc-600">ou</span>
            <div className="flex-1 h-px bg-zinc-300" />
          </div>

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => setApiError('Login com Google em desenvolvimento.')}
          >
            🔵 Entrar com Google
          </Button>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-600">
              Não tem conta?{' '}
              <Link href="/auth/registro" className="text-amber-600 hover:text-amber-700 font-semibold">
                Registre-se aqui
              </Link>
            </p>
          </div>

          {/* Help Links */}
          <div className="mt-4 flex justify-center gap-4 text-xs">
            <Link href="#" className="text-zinc-600 hover:text-zinc-900">
              Esqueceu a senha?
            </Link>
            <span className="text-zinc-300">•</span>
            <Link href="#" className="text-zinc-600 hover:text-zinc-900">
              Ajuda
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* MODAL DE ERRO CUSTOMIZADO (Sobreposição dinâmica) */}
      {apiError && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 px-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm border-none shadow-2xl bg-white text-center p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <CardHeader className="p-0">
              <div className="mx-auto my-1 text-4xl text-center">❌</div>
              <CardTitle className="text-xl text-zinc-800 pt-2">
                Falha na Autenticação
              </CardTitle>
              <CardDescription className="text-zinc-500 text-sm font-normal mt-1.5 leading-relaxed">
                {apiError}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 pt-2">
              <Button
                type="button"
                onClick={() => setApiError(null)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-sm py-2 font-medium"
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