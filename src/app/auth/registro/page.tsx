'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpa o erro do campo assim que o usuário começa a digitar de novo
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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
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
      // Ajuste a URL para o endpoint correto do seu identity-ms se necessário
      const response = await fetch('http://localhost:8080/identity-ms/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Erro: ${data.error || 'Falha ao registrar conta.'}`);
        return;
      }

      alert('Conta criada com sucesso! Faça login para continuar.');
      
      // Redireciona para a página de login
      window.location.href = '/auth/login';

    } catch (error: unknown) {
      console.error('Erro na requisição:', (error as Error).message);
      alert('Ocorreu um erro ao tentar criar sua conta. Por favor, tente novamente mais tarde.');
    } {
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
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirmar Senha"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Repita sua senha"
              error={errors.confirmPassword}
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
    </div>
  );
}