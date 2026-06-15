'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-[#1c1c1e] text-zinc-400 text-sm border-t border-zinc-800 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        
        <div className="space-y-3">
          <span className="text-xl font-bold text-white flex items-center gap-2">
            ✂️ Barbearia Network
          </span>
          <p className="text-zinc-500 text-xs font-light leading-relaxed">
            A maior e melhor rede de barbearias premium conectada para proporcionar estilo, conforto e agilidade no seu dia a dia.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Links Úteis</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-amber-500 transition-colors">Home</Link></li>
            <li><Link href="/agendar" className="hover:text-amber-500 transition-colors">Agendar Horário</Link></li>
            <li><Link href="/dashboard" className="hover:text-amber-500 transition-colors">Dashboard</Link></li>
            <li><Link href="/conta" className="hover:text-amber-500 transition-colors">Minha Conta</Link></li>
          </ul>
        </div>

        <div className="space-y-2 text-xs">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Funcionamento</h4>
          <p><span className="text-zinc-500">Segunda a Sexta:</span> 08:00 às 18:00</p>
          <p><span className="text-zinc-500">Sábado:</span> 08:00 às 18:00</p>
          <p className="pt-2 text-zinc-500">Contato: suporte@barbearia.network</p>
        </div>

      </div>

      <div className="w-full bg-[#151517] py-4 text-center text-xs text-zinc-600 border-t border-zinc-900/40">
        &copy; {new Date().getFullYear()} Barbearia Network. Todos os direitos reservados.
      </div>
    </footer>
  );
}