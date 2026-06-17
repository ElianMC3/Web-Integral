import React, { useState } from 'react';
import { useStore } from '../../context/useStore';
import PrivacyConsent from '../../components/PrivacyConsent';

export default function LoginView3() {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'demo@seda.org');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FDF8F5] font-sans relative overflow-hidden">
      {/* Left Pane (Form) */}
      <div className="w-1/2 flex flex-col justify-between p-16 relative overflow-hidden bg-white z-10">
        <div className="flex-1 flex flex-col justify-center max-w-[420px] mx-auto w-full">
          <h2 className="text-[40px] font-black text-neutral-800 tracking-tight leading-tight select-none">
            Inicio de Sesión
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

            {/* Password Input */}
            <div className="relative">
              <span className="absolute -top-2.5 left-5 bg-white px-2 text-[10px] font-bold text-slate-400 tracking-wider">
                Contraseña
              </span>
              <input
                type="password"
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
                  id="not-a-robot-3"
                  required
                  className="w-6 h-6 border-2 border-slate-300 rounded text-amber-800 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="not-a-robot-3" className="text-xs font-bold text-slate-600 select-none cursor-pointer">
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

            {/* Aviso de Privacidad — consentimiento obligatorio */}
            <PrivacyConsent id="privacy-consent-login3" />

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

        {/* Soft curving peach background in the bottom left corner */}
        <div className="absolute bottom-0 left-0 w-[300px] h-[150px] bg-[#EED6C4]/50 rounded-tr-[200px] -z-10" />
      </div>

      {/* Right Pane (Image + Overlay) */}
      <div className="w-1/2 relative flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Background Image of grains and sacks */}
        <img
          src="https://images.unsplash.com/photo-1595856169990-ac9b49f85213?auto=format&fit=crop&q=80&w=800"
          alt="Sacos de granos alimenticios"
          className="absolute inset-0 w-full h-full object-cover opacity-60 filter saturate-50 contrast-125"
        />
        {/* Dark warm overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/40 to-neutral-900/70" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-12 max-w-lg">
          {/* Outlined SEDA Logo */}
          <h1 
            className="text-8xl font-black tracking-widest text-transparent select-none mb-4"
            style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.95)' }}
          >
            SEDA
          </h1>

          {/* White Food Box Icon */}
          <div className="mb-6 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              className="w-32 h-32"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
            >
              {/* Cardboard box outline */}
              <polygon points="15,48 50,32 85,48 50,64" strokeWidth="4.5" />
              <polygon points="15,48 15,80 50,92 50,64" />
              <polygon points="85,48 85,80 50,92 50,64" />
              {/* Milk Carton inside */}
              <rect x="60" y="22" width="10" height="18" fill="none" strokeWidth="3" />
              <polygon points="60,22 65,16 70,22" fill="none" strokeWidth="3" />
              {/* Bread slice outline */}
              <path d="M42,32 C42,26 50,26 50,32" strokeWidth="3.5" />
              <path d="M46,32 C46,27 54,27 54,32" strokeWidth="3.5" />
              {/* Cans */}
              <rect x="30" y="30" width="8" height="12" rx="1" strokeWidth="3" />
              <line x1="30" y1="34" x2="38" y2="34" />
              <line x1="30" y1="38" x2="38" y2="38" />
            </svg>
          </div>

          {/* Title Text */}
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Sistema de Entrega y Distribución Alimentaria
          </h2>
        </div>
      </div>
    </div>
  );
}
