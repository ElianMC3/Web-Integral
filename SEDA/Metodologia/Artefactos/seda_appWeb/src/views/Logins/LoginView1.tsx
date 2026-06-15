import React, { useState } from 'react';
import { useStore } from '../../context/useStore';

export default function LoginView1() {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'demo@seda.org');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FDF8F5] font-sans">
      {/* Left Pane */}
      <div className="w-1/2 flex flex-col justify-between p-20 relative overflow-hidden bg-white">
        <div className="flex-1 flex flex-col justify-center max-w-md">
          <h1 className="text-8xl font-black tracking-tight text-neutral-800 select-none">
            SEDA
          </h1>
          <p className="text-[28px] font-semibold text-neutral-700 mt-4 leading-snug">
            Sistema de Entrega y Distribución Alimentaria
          </p>
        </div>
        
        {/* Soft curving peach background in the bottom left corner */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[250px] bg-[#EED6C4]/70 rounded-tr-[300px] -z-10" />
      </div>

      {/* Right Pane */}
      <div className="w-1/2 flex items-center justify-center bg-gradient-to-tr from-[#EED6C4]/30 via-white to-[#EED6C4]/10 p-12">
        <div className="w-full max-w-[460px] bg-white rounded-3xl p-10 shadow-[0_20px_50px_-20px_rgba(154,107,76,0.15)] border border-slate-100 flex flex-col items-center">
          
          <h2 className="text-5xl font-black tracking-tight text-neutral-800 select-none mb-2">
            SEDA
          </h2>
          <p className="text-slate-500 font-bold text-sm tracking-wide mb-8">
            Bienvenido de nuevo
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            {/* Email Input */}
            <div className="relative">
              <span className="absolute -top-2.5 left-5 bg-white px-2 text-[10px] font-bold text-slate-400 tracking-wider">
                Ingresa tu correo
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full h-12 px-5 rounded-full border border-slate-200 focus:outline-none focus:border-peach-accent text-sm font-semibold text-slate-700 bg-transparent placeholder:text-slate-300"
              />
            </div>

            {/* Password Input (replicates the tu@email.com placeholder exactly from Page 1 PDF) */}
            <div className="relative">
              <span className="absolute -top-2.5 left-5 bg-white px-2 text-[10px] font-bold text-slate-400 tracking-wider">
                Contraseña
              </span>
              <input
                type="text" // using text type so we see the exact placeholder, but user can input password too
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="tu@email.com"
                className="w-full h-12 px-5 rounded-full border border-slate-200 focus:outline-none focus:border-peach-accent text-sm font-semibold text-slate-700 bg-transparent placeholder:text-slate-300"
              />
            </div>

            {/* Mock Recaptcha Widget */}
            <div className="border border-slate-200 rounded-lg p-3 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="not-a-robot"
                  required
                  className="w-6 h-6 border-2 border-slate-300 rounded text-amber-800 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="not-a-robot" className="text-xs font-bold text-slate-600 select-none cursor-pointer">
                  I'm not a robot
                </label>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                  alt="reCAPTCHA"
                  className="w-6 h-6 object-contain"
                />
                <span className="text-[7px] text-slate-400 font-semibold mt-0.5">reCAPTCHA</span>
                <span className="text-[6px] text-slate-400">Privacy - Terms</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 bg-[#9A6B4C] hover:bg-[#855A3E] text-white font-bold rounded-full transition-all duration-200 flex items-center justify-center space-x-2 shadow-md shadow-[#9A6B4C]/25 text-sm"
            >
              <span>Ingresar</span>
              <span className="text-white/80 font-normal">&gt;</span>
            </button>
          </form>

          {/* Social login */}
          <div className="w-full mt-6">
            <div className="flex items-center space-x-3">
              <div className="flex-1 h-[1px] bg-slate-200" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Iniciar con</span>
              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>

            <div className="flex items-center justify-center space-x-4 mt-4">
              <button className="w-9 h-9 rounded-full bg-[#9A6B4C]/10 hover:bg-[#9A6B4C]/20 flex items-center justify-center text-[#9A6B4C] font-bold text-sm transition-all">
                G
              </button>
              <button className="w-9 h-9 rounded-full bg-[#9A6B4C]/10 hover:bg-[#9A6B4C]/20 flex items-center justify-center text-[#9A6B4C] font-bold text-sm transition-all">
                f
              </button>
              <button className="w-9 h-9 rounded-full bg-[#9A6B4C]/10 hover:bg-[#9A6B4C]/20 flex items-center justify-center text-[#9A6B4C] font-bold text-sm transition-all">
                P
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
