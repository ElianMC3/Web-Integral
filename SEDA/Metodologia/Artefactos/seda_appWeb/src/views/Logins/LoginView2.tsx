import React, { useState } from 'react';
import { useStore } from '../../context/useStore';
import { Mail, Shield } from 'lucide-react';

export default function LoginView2() {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'demo@seda.org');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#EED6C4] font-sans relative overflow-hidden select-none">
      {/* Left side text */}
      <div className="w-1/2 flex flex-col justify-between p-20 z-10">
        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <h2 className="text-[52px] font-extrabold text-[#78281F] leading-tight mb-8">
            Uniendo la abundancia con la esperanza.
          </h2>
        </div>
        
        {/* Large Logo SEDA in bottom left */}
        <div>
          <h1 className="text-8xl font-black text-neutral-800 tracking-tight leading-none">
            SEDA
          </h1>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-1/2 flex items-center justify-center p-12 z-10">
        <div className="w-full max-w-[420px] bg-[#F3E2D5] rounded-3xl p-10 shadow-lg border border-white/20">
          <h3 className="text-xl font-black text-[#78281F] text-center mb-8">
            Bienvenido de nuevo
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field with Envelope Icon */}
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#78281F]">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo Electrónico"
                className="w-full h-12 pl-12 pr-4 rounded-xl border-none bg-white text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#78281F]/30"
              />
            </div>

            {/* Password Field with Shield/Lock Icon */}
            <div className="relative flex items-center">
              <span className="absolute left-4 text-[#78281F]">
                <Shield className="w-5 h-5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full h-12 pl-12 pr-4 rounded-xl border-none bg-white text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#78281F]/30"
              />
            </div>

            {/* Right-aligned White "Ingresar" button as seen in PDF */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-8 h-10 bg-white hover:bg-slate-50 text-[#78281F] font-bold text-xs rounded-xl transition-all shadow-sm border border-[#78281F]/10"
              >
                Ingresar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Cardboard food box illustration in the bottom right corner */}
      <div className="absolute bottom-10 right-10 opacity-70">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-24 h-24 text-neutral-800"
          fill="currentColor"
        >
          {/* Custom SVG replicating the box of food (can, milk bottle, bread, box) */}
          <path d="M50,45 L80,30 L80,35 L50,50 L20,35 L20,30 Z" opacity="0.3" />
          <rect x="25" y="50" width="50" height="35" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
          {/* Bread */}
          <path d="M30,48 C30,40 38,40 38,48" stroke="currentColor" strokeWidth="4" fill="none" />
          <path d="M34,48 C34,42 42,42 42,48" stroke="currentColor" strokeWidth="4" fill="none" />
          {/* Can */}
          <rect x="48" y="38" width="10" height="15" rx="2" stroke="currentColor" strokeWidth="3" fill="none" />
          <line x1="48" y1="43" x2="58" y2="43" stroke="currentColor" strokeWidth="2" />
          <line x1="48" y1="48" x2="58" y2="48" stroke="currentColor" strokeWidth="2" />
          {/* Milk box */}
          <rect x="62" y="32" width="10" height="20" stroke="currentColor" strokeWidth="3" fill="none" />
          <path d="M62,32 L67,26 L72,32 Z" stroke="currentColor" strokeWidth="3" fill="none" />
        </svg>
      </div>
    </div>
  );
}
