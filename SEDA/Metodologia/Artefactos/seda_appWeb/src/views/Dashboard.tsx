import { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/useStore';
import {
  TrendingUp,
  Calendar,
  ThermometerSnowflake,
  Truck,
  AlertTriangle,
  PlusCircle,
  Box,
  Compass,
  MessageSquare,
  Send,
  X,
  ChevronDown,
  Phone
} from 'lucide-react';

// ─── Floating Chat Widget ────────────────────────────────────────────────────
interface ChatMsg { id: number; from: 'me' | 'conductor'; text: string; time: string; }

function FloatingChat({ isOpen, onClose, contactName }: { isOpen: boolean; onClose: () => void; contactName: string }) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 1, from: 'conductor', text: ` ${contactName}.`, time: '' }
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMsg = { id: Date.now(), from: 'me', text: input.trim(), time: now };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Simulate auto-reply
    setTimeout(() => {
      const replies = [
        'Entendido, procedo de inmediato.',
        'De acuerdo, en camino.',
        'Recibido. Lo atiendo enseguida.',
        'Confirmo la instrucción.',
      ];
      const reply: ChatMsg = {
        id: Date.now() + 1,
        from: 'conductor',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col animate-slide-up" style={{ width: '320px' }}>
      {/* Chat window */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: isMinimized ? 'auto' : '420px' }}>

        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center font-black text-sm">
                {contactName.charAt(0)}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">{contactName}</p>
              <p className="text-[9px] text-blue-200 font-semibold">En línea • Conductor</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMinimized(m => !m)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50" style={{ minHeight: '240px', maxHeight: '240px' }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.from === 'me' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-[11px] font-semibold leading-relaxed ${msg.from === 'me'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-bl-sm'
                    }`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-slate-400 font-bold mt-1 px-1">{msg.time}</span>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-100 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 h-9 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-300 text-slate-700"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl flex items-center justify-center transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard Component ────────────────────────────────────────────────
export default function Dashboard() {
  const {
    setTab,
    operationalAlerts,
    resolveOperationalAlert,
    donations
  } = useStore();

  const [graphTab, setGraphTab] = useState<'semana' | 'mes'>('semana');

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContact, setChatContact] = useState('');

  const openChat = (name: string) => {
    setChatContact(name);
    setChatOpen(true);
  };

  const activeDonationsWeight = donations.reduce((sum, d) => sum + d.weight, 0);
  const totalDonationsToday = 4250 + activeDonationsWeight - 415;

  return (
    <>
      {/* Floating Chat */}
      <FloatingChat isOpen={chatOpen} onClose={() => setChatOpen(false)} contactName={chatContact} />

      <div className="p-8 space-y-8 animate-fade-in select-none">
        {/* Operating Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Resumen Operativo • Hoy, Lunes, 11 de mayo de 2026</span>
            </div>
            <div className="flex items-center space-x-3 mt-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
                Operaciones Normales
              </span>
              <span className="text-xs text-slate-400 font-bold">•</span>
              <span className="text-xs font-bold text-slate-600">Turno Mañana</span>
            </div>
          </div>

          {/* Quick action buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setTab('reception')}
              className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              <span>+ Registrar Donación</span>
            </button>
            <button
              onClick={() => setTab('packaging')}
              className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <Box className="w-4 h-4 text-emerald-600" />
              <span>Crear Tarea Empacado</span>
            </button>
            <button
              onClick={() => setTab('logistics')}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-600/10"
            >
              <Compass className="w-4 h-4" />
              <span>Planificar Ruta</span>
            </button>
          </div>
        </div>

        {/* Main Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Donaciones del Día */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Donaciones del Día</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><TrendingUp className="w-4 h-4" /></div>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-slate-800 tracking-tight">
                {totalDonationsToday.toLocaleString('es-ES')} <span className="text-sm font-bold text-slate-400">kg</span>
              </span>
            </div>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+12%</span>
              <span className="text-[10px] font-bold text-slate-400">vs ayer</span>
            </div>
          </div>

          {/* Card 2: % Perecederos */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">% Perecederos</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><ThermometerSnowflake className="w-4 h-4" /></div>
            </div>
            <div className="mt-2"><span className="text-3xl font-black text-slate-800 tracking-tight">38%</span></div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '38%' }} />
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mt-1">
              <span>Estable</span>
              <span>Estándar: 35%</span>
            </div>
          </div>

          {/* Card 3: Capacidad Cámara Frío */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Capacidad Cámara Frío</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><AlertTriangle className="w-4 h-4" /></div>
            </div>
            <div className="mt-2"><span className="text-3xl font-black text-slate-800 tracking-tight">85%</span></div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '85%' }} />
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mt-1">
              <span className="text-amber-600 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded">Casi Lleno</span>
              <span>Máx: 95%</span>
            </div>
          </div>

          {/* Card 4: Rutas Activas */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-36">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Rutas Activas</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Truck className="w-4 h-4" /></div>
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-slate-800 tracking-tight">24 <span className="text-sm font-bold text-slate-400">vehículos</span></span>
            </div>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">+3</span>
              <span className="text-[10px] font-bold text-slate-400">en la última hora</span>
            </div>
          </div>
        </div>

        {/* Main Charts & Map Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Volume and Category Inventories */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 tracking-tight">Volumen de Recepción</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Tendencia semanal por categoría</p>
                </div>
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button onClick={() => setGraphTab('semana')} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${graphTab === 'semana' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Semana</button>
                  <button onClick={() => setGraphTab('mes')} className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${graphTab === 'mes' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Mes</button>
                </div>
              </div>

              <div className="h-60 w-full relative pt-2">
                <svg className="w-full h-full" viewBox="0 0 500 200">
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeDasharray="4" />
                  <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeDasharray="4" />
                  <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeDasharray="4" />
                  <line x1="40" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeDasharray="4" />
                  <line x1="40" y1="180" x2="480" y2="180" stroke="#e2e8f0" />
                  <text x="30" y="24" className="text-[9px] font-bold fill-slate-400 text-right">2500</text>
                  <text x="30" y="64" className="text-[9px] font-bold fill-slate-400 text-right">2000</text>
                  <text x="30" y="104" className="text-[9px] font-bold fill-slate-400 text-right">1500</text>
                  <text x="30" y="144" className="text-[9px] font-bold fill-slate-400 text-right">1000</text>
                  <text x="30" y="184" className="text-[9px] font-bold fill-slate-400 text-right">0</text>
                  <text x="50" y="195" className="text-[9px] font-bold fill-slate-400 text-center">Lun</text>
                  <text x="120" y="195" className="text-[9px] font-bold fill-slate-400 text-center">Mar</text>
                  <text x="190" y="195" className="text-[9px] font-bold fill-slate-400 text-center">Mié</text>
                  <text x="260" y="195" className="text-[9px] font-bold fill-slate-400 text-center">Jue</text>
                  <text x="330" y="195" className="text-[9px] font-bold fill-slate-400 text-center">Vie</text>
                  <text x="400" y="195" className="text-[9px] font-bold fill-slate-400 text-center">Sáb</text>
                  <text x="470" y="195" className="text-[9px] font-bold fill-slate-400 text-center">Dom</text>
                  <path d="M 50 140 Q 120 80 190 110 T 330 50 T 470 70" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx="190" cy="110" r="4" className="fill-emerald-500 stroke-white stroke-2" />
                  <circle cx="330" cy="50" r="4" className="fill-emerald-500 stroke-white stroke-2" />
                  <path d="M 50 160 Q 120 120 190 80 T 330 110 T 470 40" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx="190" cy="80" r="4" className="fill-blue-500 stroke-white stroke-2" />
                  <circle cx="470" cy="40" r="4" className="fill-blue-500 stroke-white stroke-2" />
                </svg>
              </div>

              <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-slate-50">
                <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500">
                  <span className="w-3 h-1.5 bg-emerald-500 rounded-full" />
                  <span>Perecederos</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500">
                  <span className="w-3 h-1.5 bg-blue-500 rounded-full" />
                  <span>No Perecederos</span>
                </div>
              </div>
            </div>

            {/* Operational Alerts Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 tracking-tight">Alertas Operativas</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Alertas críticas que requieren tu atención</p>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Ver todas</button>
              </div>

              <div className="space-y-3">
                {operationalAlerts.filter(a => !a.resolved).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 ${alert.level === 'URGENTE'
                        ? 'bg-red-50/50 border-red-100 text-red-900'
                        : 'bg-amber-50/50 border-amber-100 text-amber-900'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-xl mt-0.5 ${alert.level === 'URGENTE' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-extrabold">{alert.title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase ${alert.level === 'URGENTE' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                              {alert.level}
                            </span>
                          </div>
                          <p className="text-slate-600 font-semibold text-[11px] mt-1">{alert.desc}</p>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{alert.details}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {alert.type === 'caducidad' ? (
                          <>
                            <button
                              onClick={() => resolveOperationalAlert(alert.id, 'Asignado a ruta rápida')}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all"
                            >
                              Asignar a ruta rápida
                            </button>
                            <button
                              onClick={() => resolveOperationalAlert(alert.id, 'Descartado por caducidad')}
                              className="bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all"
                            >
                              Descartar
                            </button>
                          </>
                        ) : (
                          <>
                            {/* ── "Contactar" abre el chat flotante ── */}
                            <button
                              onClick={() => openChat(alert.contactName || 'Conductor Desconocido')}
                              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Contactar</span>
                            </button>
                            <button
                              onClick={() => resolveOperationalAlert(alert.id, 'Re-enrutado')}
                              className="bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all"
                            >
                              Re-enrutar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {operationalAlerts.filter(a => !a.resolved).length === 0 && (
                  <div className="text-center py-6 text-slate-400 font-semibold text-xs border-2 border-dashed border-slate-100 rounded-2xl">
                    Sin alertas pendientes. Todo en orden.
                  </div>
                )}
              </div>

              {/* Floating chat hint when closed */}
              {!chatOpen && operationalAlerts.filter(a => !a.resolved && a.type !== 'caducidad').length > 0 && (
                <button
                  onClick={() => openChat('Equipo Operativo')}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 border border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 rounded-xl text-[10px] font-bold text-blue-600 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Abrir canal de comunicación</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Logistic Map and Inventories */}
          <div className="space-y-8">
            {/* SVG Map Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[360px]">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 tracking-tight">Mapa Logístico</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Ubicaciones y vehículos</p>
                </div>
                <button title="Capas de mapa" className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                  <span className="text-slate-400 font-bold text-xs">🌐</span>
                </button>
              </div>

              <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-2xl relative overflow-hidden flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 200 180">
                  <line x1="50" y1="120" x2="100" y2="90" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="3" />
                  <line x1="100" y1="90" x2="150" y2="60" stroke="#10b981" strokeWidth="2.5" />
                  <line x1="100" y1="90" x2="160" y2="120" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
                  <circle cx="50" cy="120" r="5" className="fill-blue-600 stroke-blue-200 stroke-4" />
                  <rect x="94" y="84" width="12" height="12" rx="2" className="fill-blue-900 stroke-blue-100 stroke-2" />
                  <text x="100" y="108" className="text-[7px] font-black fill-slate-700 text-center" textAnchor="middle">Sede Central</text>
                  <circle cx="150" cy="60" r="5" className="fill-emerald-600 stroke-emerald-200 stroke-4" />
                  <circle cx="160" cy="120" r="5" className="fill-amber-500 stroke-amber-200 stroke-4" />
                </svg>
              </div>

              <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 mt-4 px-2">
                <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-950" /><span>Sede Central</span></div>
                <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-600" /><span>Despensa</span></div>
                <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-600" /><span>Donante</span></div>
                <div className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500" /><span>Ruta</span></div>
              </div>
            </div>

            {/* Inventario por Categoría */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 tracking-tight">Inventario por Categoría</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Distribución física actual</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'No Perecederos', pct: 45, color: 'bg-blue-600' },
                  { label: 'Frutas y Verduras', pct: 30, color: 'bg-emerald-500' },
                  { label: 'Lácteos y Frío', pct: 15, color: 'bg-amber-500' },
                  { label: 'Otros', pct: 10, color: 'bg-slate-400' },
                ].map(({ label, pct, color }) => (
                  <div key={label} className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-extrabold text-slate-700">
                      <span className="flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${color}`} />
                        <span>{label}</span>
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`${color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
