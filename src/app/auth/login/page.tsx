'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

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
      
        alert(`Erro: ${data.error}`);
        return;
      }

      if (data.token) localStorage.setItem('token', data.token);

      setFormData({ email: '', password: '' });
      window.location.href = '/';

    } catch (error: unknown) {
      
      console.error('Erro na requisição:', (error as Error).message);
      alert('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente mais tarde.');
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-zinc-100 to-zinc-50 px-4">
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
            onClick={() => alert('Google login - Em desenvolvimento')}
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
    </div>
  );
}
