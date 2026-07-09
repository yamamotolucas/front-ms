'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// --- INTERFACES ---
interface UserData {
  id: number;
  name: string;
  email: string;
}

export function AccountSettings() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<UserData>({
    id: 0,
    name: '',
    email: ''
  });

  // Estados de controle do formulário
  const [formData, setFormData] = useState({ name: '' });
  const [passwordData, setPasswordData] = useState({
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Validação de autenticação inicial e carregamento de dados
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setHasToken(false);
      setIsLoading(false);
      return;
    }
    setHasToken(true);

    async function fetchUserData() {
      try {
        const response = await fetch('http://localhost:8080/identity-ms/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Erro ao carregar dados do usuário');

        const data: UserData = await response.json();
        setUserData(data);
        setFormData({ name: data.name });
      } catch (error) {
        console.error('Erro ao buscar dados da conta:', error);
        setMessage({ type: 'error', text: 'Não foi possível carregar os dados do perfil.' });
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    if (passwordData.newPassword && passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'A nova senha e a confirmação não conferem.' });
      setIsUpdating(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        ...(passwordData.password && {
          password: passwordData.password,
          newPassword: passwordData.newPassword,
          confirmationNewPassword: passwordData.confirmPassword
        })
      };

      const response = await fetch(`http://localhost:8080/identity-ms/v1/users/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.text();
        if(error.includes('Current password is incorrect')) {
          throw new Error('Senha atual incorreta. Por favor, tente novamente.');
        }
        
        throw new Error(error || 'Erro ao atualizar dados da conta.');
      }

      setPasswordData({ password: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Dados atualizados com sucesso! Você será redirecionado para a página de login.' });
      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/auth/login';
      }, 2000);

    } catch (error: any) {
      console.error('Erro ao atualizar dados da conta:', error);
      setMessage({ type: 'error', text: error.message || 'Ocorreu um erro ao salvar as alterações.' });
    } finally {
      setIsUpdating(false);
    }
  };

  // --- TELA SESSÃO CARREGANDO ---
  if (isLoading && hasToken === null) {
    return (
      <div className="min-h-screen w-full bg-zinc-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-amber-600" />
      </div>
    );
  }

  // --- TELA DE BLOQUEIO (SEM TOKEN / NÃO LOGADO) ---
  if (hasToken === false) {
    return (
      <div className="min-h-screen w-full bg-zinc-50 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-zinc-200 bg-white shadow-xs text-center">
          <CardContent className="p-6 space-y-4">
            <div className="text-4xl">🔐</div>
            <h3 className="text-xl font-bold text-zinc-800">Acesso Restrito</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Você precisa estar logado na sua conta para visualizar ou alterar as suas configurações de perfil.
            </p>
            <Button 
              onClick={() => window.location.href = '/auth/login'}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 cursor-pointer border-none rounded-lg text-sm"
            >
              Fazer Login Agora
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-50 text-zinc-900 px-4 py-12 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* CABEÇALHO DA TELA */}
        <div className="flex items-center gap-2 border-b border-zinc-200 pb-4 text-left">
          <span className="flex h-3 w-3 rounded-full bg-amber-500" />
          <h2 className="text-xl font-bold text-zinc-800">Minha Conta</h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-amber-600" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* CONTAINER 1: DADOS BÁSICOS */}
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

                {/* CAMPO: NOME COMPLETO */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleProfileChange}
                    placeholder="Seu nome completo"
                    className="w-full text-sm bg-white border border-zinc-300 rounded-lg px-3.5 py-2 font-medium text-zinc-800 outline-hidden focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* CAMPO: EMAIL (BLOQUEADO) */}
                <div className="flex flex-col gap-1.5 text-left opacity-75">
                  <div className="flex items-center justify-between">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      E-mail institucional
                    </label>
                    <span className="text-[10px] bg-zinc-100 text-zinc-500 border border-zinc-200 font-medium px-1.5 py-0.5 rounded">
                      Não editável
                    </span>
                  </div>
                  <input
                    type="email"
                    id="email"
                    disabled
                    value={userData.email}
                    className="w-full text-sm bg-zinc-50 border border-zinc-200 text-zinc-500 rounded-lg px-3.5 py-2 font-medium cursor-not-allowed outline-hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* CONTAINER 2: SEÇÃO DE ALTERAR SENHA */}
            <div className="text-left pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3">Segurança e Senha</h3>
            </div>

            <Card className="border-zinc-200 bg-white shadow-xs">
              <CardContent className="p-6 space-y-5">
                
                {/* CAMPO: SENHA ATUAL */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={passwordData.password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full text-sm bg-white border border-zinc-300 rounded-lg px-3.5 py-2 font-medium text-zinc-800 outline-hidden focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* GRID DE DUAS COLUNAS PARA SENHA NOVA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* CAMPO: NOVA SENHA */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label htmlFor="newPassword" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      required={!!passwordData.password}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full text-sm bg-white border border-zinc-300 rounded-lg px-3.5 py-2 font-medium text-zinc-800 outline-hidden focus:border-amber-500 transition-colors"
                    />
                  </div>

                  {/* CAMPO: CONFIRME A NOVA SENHA */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Confirme a Nova Senha
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      required={!!passwordData.password}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Repita a nova senha"
                      className="w-full text-sm bg-white border border-zinc-300 rounded-lg px-3.5 py-2 font-medium text-zinc-800 outline-hidden focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* BOTÃO DE SALVAR ALTERAÇÕES */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                isLoading={isUpdating}
                disabled={isLoading}
                className="bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold py-2.5 px-5 rounded-lg shadow-sm transition-all cursor-pointer border-none"
              >
                Salvar Alterações
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}