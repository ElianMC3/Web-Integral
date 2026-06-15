import { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/useStore';
import type { Donation } from '../context/useStore';
import { Search, Plus, Upload, Trash2, Printer, CheckCircle, AlertTriangle, X, User, Phone, Mail, Building2, FileText, Tag } from 'lucide-react';

// ─── Modal: Nuevo Donante ────────────────────────────────────────────────────
function NuevoDonantModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState({
    nombre: '', empresa: '', rfc: '', telefono: '', email: '',
    direccion: '', categoria: 'Categoría A', tipo: 'Recurrente', notas: ''
  });

  const handleChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`✅ Donante "${form.nombre}" registrado con éxito.`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-50 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm shadow-blue-600/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Nuevo Donante</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Registro en el sistema</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1"><User className="w-3 h-3" /><span>Nombre Completo / Razón Social</span></label>
              <input required value={form.nombre} onChange={e => handleChange('nombre', e.target.value)} placeholder="Ej. Juan Pérez García" className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50 placeholder:text-slate-300" />
            </div>

            {/* Empresa */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1"><Building2 className="w-3 h-3" /><span>Empresa / Organización</span></label>
              <input value={form.empresa} onChange={e => handleChange('empresa', e.target.value)} placeholder="Ej. Supermercados XYZ" className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50 placeholder:text-slate-300" />
            </div>

            {/* RFC */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1"><FileText className="w-3 h-3" /><span>RFC / ID Fiscal</span></label>
              <input value={form.rfc} onChange={e => handleChange('rfc', e.target.value)} placeholder="Ej. XAXX010101000" className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50 placeholder:text-slate-300" />
            </div>

            {/* Teléfono */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1"><Phone className="w-3 h-3" /><span>Teléfono</span></label>
              <input type="tel" value={form.telefono} onChange={e => handleChange('telefono', e.target.value)} placeholder="Ej. 55 1234 5678" className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50 placeholder:text-slate-300" />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1"><Mail className="w-3 h-3" /><span>Correo Electrónico</span></label>
              <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="donante@empresa.com" className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50 placeholder:text-slate-300" />
            </div>

            {/* Categoría */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1"><Tag className="w-3 h-3" /><span>Categoría</span></label>
              <select value={form.categoria} onChange={e => handleChange('categoria', e.target.value)} className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50">
                <option>Categoría A</option>
                <option>Categoría B</option>
                <option>Categoría C</option>
                <option>Corporativo</option>
              </select>
            </div>

            {/* Tipo */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipo de Donante</label>
              <select value={form.tipo} onChange={e => handleChange('tipo', e.target.value)} className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50">
                <option>Recurrente</option>
                <option>Eventual</option>
                <option>Corporativo</option>
                <option>Institucional</option>
              </select>
            </div>

            {/* Dirección */}
            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dirección de Recolección</label>
              <input value={form.direccion} onChange={e => handleChange('direccion', e.target.value)} placeholder="Calle, Número, Colonia, Ciudad" className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50 placeholder:text-slate-300" />
            </div>

            {/* Notas */}
            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Notas Adicionales</label>
              <textarea rows={2} value={form.notas} onChange={e => handleChange('notas', e.target.value)} placeholder="Días disponibles, instrucciones especiales..." className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50 placeholder:text-slate-300 resize-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2 border-t border-slate-50">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all">
              Cancelar
            </button>
            <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/10 transition-all flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>Registrar Donante</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal: Imprimir Bitácora de Turno ──────────────────────────────────────
function ImprimirBitacoraModal({ isOpen, onClose, donations }: { isOpen: boolean; onClose: () => void; donations: Donation[] }) {
  const [formato, setFormato] = useState<'completo' | 'resumen' | 'alertas'>('completo');
  const [fechaTurno] = useState(new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-50 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-800 text-white rounded-xl">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Bitácora de Turno</h3>
              <p className="text-[10px] text-slate-400 font-semibold">{fechaTurno}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Vista previa resumen */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Vista Previa del Reporte</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-2xl font-black text-slate-800">{donations.length}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Entradas</p>
              </div>
              <div className="text-center border-x border-slate-200">
                <p className="text-2xl font-black text-emerald-600">{donations.filter(d => d.status === 'Aprobado').length}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Aprobadas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-amber-600">{donations.filter(d => d.status !== 'Aprobado').length}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Pendientes</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-1">
              <span>Total recepcionado</span>
              <span className="text-slate-800 font-black">{donations.reduce((s, d) => s + d.weight, 0).toFixed(1)} kg</span>
            </div>
          </div>

          {/* Formato de impresión */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Formato del Reporte</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: 'completo', label: 'Completo', desc: 'Todos los registros' },
                { id: 'resumen', label: 'Resumen', desc: 'Solo métricas' },
                { id: 'alertas', label: 'Alertas', desc: 'Incidencias' },
              ] as const).map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFormato(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    formato === opt.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[11px] font-bold">{opt.label}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Opciones adicionales */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Opciones</label>
            <div className="space-y-2">
              {['Incluir firmas digitales', 'Incluir código QR de verificación', 'Incluir evidencias fotográficas'].map(opt => (
                <label key={opt} className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input type="checkbox" defaultChecked className="rounded accent-blue-600 w-3.5 h-3.5" />
                  <span className="text-xs font-semibold text-slate-600">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2 border-t border-slate-50">
            <button onClick={onClose} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all">
              Cancelar
            </button>
            <button
              onClick={() => { alert(`🖨️ Generando bitácora en formato ${formato.toUpperCase()}...`); onClose(); }}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Exportar PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Reception() {
  const { donations, addDonation } = useStore();
  const [activeBitacoraTab, setActiveBitacoraTab] = useState<'Todos' | 'Pendientes' | 'Aprobados'>('Todos');
  const [bitacoraFilter, setBitacoraFilter] = useState('');

  // Modal states
  const [showNuevoDonante, setShowNuevoDonante] = useState(false);
  const [showImprimirBitacora, setShowImprimirBitacora] = useState(false);

  // Form State
  const donorName = 'Supermercados Cuitlahuac';
  const donorId = 'DON-8492';
  const donorCategory = 'Categoría A';
  
  const [isPerecedero, setIsPerecedero] = useState(false);
  const [category, setCategory] = useState('Abarrotes');
  const [weight, setWeight] = useState('0.00');
  const [batchNumber, setBatchNumber] = useState('L-48291');
  const [expirationDate, setExpirationDate] = useState('2026-06-30');
  const [temperature, setTemperature] = useState('18');
  const [vehicleStatus, setVehicleStatus] = useState('Óptimo');
  const [notes, setNotes] = useState('');
  
  // Signature pad states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // File upload simulation
  const [files, setFiles] = useState<{ name: string; size: string }[]>([
    { name: 'mercancia_1.jpg', size: '1.2 MB' }
  ]);

  // Signature drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#2c2c2c';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    let status: Donation['status'] = 'Aprobado';
    let issueDetails = '';
    const tempNum = parseFloat(temperature);
    
    if (isPerecedero && tempNum > 6) {
      status = 'Retenido';
      issueDetails = `Temperatura de llegada límite (${tempNum}°C). Requiere inspección de calidad.`;
    } else if (category === 'Mixto' || !expirationDate) {
      status = 'Pendiente Clasificación';
    }

    addDonation({
      donorName, donorId, category,
      weight: parseFloat(weight) || 0, batchNumber, expirationDate,
      temperature: tempNum, vehicleStatus, notes,
      evidenceName: files.length > 0 ? files[0].name : undefined,
      status, issueDetails
    });

    setWeight('0.00');
    setNotes('');
    clearSignature();
    alert('¡Entrada de Donación Registrada con éxito!');
  };

  const filteredDonations = donations.filter((don) => {
    if (activeBitacoraTab === 'Aprobados' && don.status !== 'Aprobado') return false;
    if (activeBitacoraTab === 'Pendientes' && don.status !== 'Pendiente Clasificación' && don.status !== 'Retenido') return false;
    if (bitacoraFilter) {
      const q = bitacoraFilter.toLowerCase();
      return (
        don.donorName.toLowerCase().includes(q) ||
        don.id.toLowerCase().includes(q) ||
        don.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      {/* Modals */}
      <NuevoDonantModal isOpen={showNuevoDonante} onClose={() => setShowNuevoDonante(false)} />
      <ImprimirBitacoraModal isOpen={showImprimirBitacora} onClose={() => setShowImprimirBitacora(false)} donations={donations} />

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in select-none">
        {/* Left side Intake Form Panel */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Donor Search / Select */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-slate-400 tracking-wide uppercase">Búsqueda / Donante</h3>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  type="text"
                  placeholder="Buscar por nombre, ID o empresa..."
                  className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-700"
                />
              </div>
              {/* ── Botón Nuevo Donante abre el Modal ── */}
              <button
                onClick={() => setShowNuevoDonante(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-600/10"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Donante</span>
              </button>
            </div>

            {/* Active Donor Card */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-extrabold text-sm select-none">
                  {donorName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs leading-tight">{donorName}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] text-slate-400 font-bold">ID: {donorId}</span>
                    <span className="text-[10px] text-slate-400 font-bold">•</span>
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{donorCategory}</span>
                  </div>
                </div>
              </div>
              <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 tracking-wider uppercase">
                Cambiar Donante
              </button>
            </div>
          </div>

          {/* Donation Details Form */}
          <form onSubmit={handleRegister} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-slate-400 tracking-wide uppercase">Detalles de la Donación</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Tipo de donacion toggle tabs */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipo de Donación</label>
                <div className="flex bg-slate-100 p-1 rounded-xl w-60">
                  <button
                    type="button"
                    onClick={() => { setIsPerecedero(false); setCategory('Abarrotes'); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      !isPerecedero ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    No Perecederos
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsPerecedero(true); setCategory('Lácteos y Frío'); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      isPerecedero ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Perecederos
                  </button>
                </div>
              </div>

              {/* Categoría Principal */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categoría Principal</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50"
                >
                  {!isPerecedero ? (
                    <>
                      <option value="Abarrotes">Abarrotes</option>
                      <option value="Granos">Granos y Semillas</option>
                      <option value="Mixto">Mixto No Perecederos</option>
                      <option value="Otros">Otros</option>
                    </>
                  ) : (
                    <>
                      <option value="Lácteos y Frío">Lácteos y Frío</option>
                      <option value="Frutas y Verduras">Frutas y Verduras</option>
                      <option value="Carnes y Embutidos">Carnes y Embutidos</option>
                      <option value="Perecederos Mixtos">Perecederos Mixtos</option>
                    </>
                  )}
                </select>
              </div>

              {/* Cantidad Total (Kg) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cantidad Total (Kg)</label>
                <input
                  type="number" step="0.01" value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50"
                />
              </div>

              {/* Número de Lote / Despensa */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Número de Lote / Despensa</label>
                <input
                  type="text" value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="Ej. L-48291"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50 placeholder:text-slate-300"
                />
              </div>

              {/* Fecha de Caducidad */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha de Caducidad</label>
                <input
                  type="date" value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50"
                />
              </div>

              {/* Cold Chain Conditions Container */}
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                  Condiciones de Transporte (Cadena de Frío)
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-extrabold text-slate-500 uppercase">Temperatura a la llegada (°C)</label>
                  <input
                    type="number" value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="Ej. 0"
                    className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-extrabold text-slate-500 uppercase">Estado del Vehículo</label>
                  <select
                    value={vehicleStatus}
                    onChange={(e) => setVehicleStatus(e.target.value)}
                    className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-white"
                  >
                    <option value="Óptimo">Óptimo</option>
                    <option value="Regular">Regular</option>
                    <option value="Deficiente">Deficiente</option>
                  </select>
                </div>
              </div>

              {/* Observaciones */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Observaciones</label>
                <textarea
                  rows={3} value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Añadir notas sobre el estado de la mercancía..."
                  className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50 placeholder:text-slate-300 resize-none"
                />
              </div>
            </div>

            {/* Validation & Signature Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              
              {/* Attachment Dropzone */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fotos / Documentos Adjuntos</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors text-center">
                  <Upload className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-[10px] font-bold text-slate-600">Arrastra archivos o haz clic</span>
                  <span className="text-[8px] text-slate-400 mt-1">PNG, JPG, PDF (Max. 5MB)</span>
                </div>
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">📄</span>
                      <span className="text-[10px] font-bold text-slate-700">{file.name}</span>
                      <span className="text-[8px] text-slate-400 font-semibold">({file.size})</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setFiles([])}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Interactive Signature Canvas */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Firma del Transportista/Donante</label>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-[9px] font-bold text-[#78281F] hover:underline uppercase tracking-wider"
                  >
                    Limpiar firma
                  </button>
                </div>
                <div className="border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden relative h-36 flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={340}
                    height={140}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="cursor-crosshair w-full h-full"
                  />
                  <span className="absolute bottom-2 right-4 text-[9px] font-bold text-slate-300 pointer-events-none select-none">
                    Firmar aquí
                  </span>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/10 transition-all flex items-center space-x-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Registrar Entrada</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right side Bitacora Logs Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[740px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Bitácora de Turno</h3>
              {/* ── Botón Imprimir abre el Modal ── */}
              <button
                onClick={() => setShowImprimirBitacora(true)}
                title="Imprimir reporte"
                className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all text-slate-400"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs: Todos, Pendientes, Aprobados */}
            <div className="flex bg-slate-100/80 p-0.5 rounded-xl mb-4">
              {(['Todos', 'Pendientes', 'Aprobados'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveBitacoraTab(tab)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    activeBitacoraTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search/Filter bar */}
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-3.5 h-3.5 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Filtrar por estado..."
                value={bitacoraFilter}
                onChange={(e) => setBitacoraFilter(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 text-slate-700"
              />
            </div>

            {/* List of Donations */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {filteredDonations.map((don) => (
                <div key={don.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-extrabold text-slate-700">{don.id}</span>
                        <span className="text-[8px] text-slate-400 font-bold">•</span>
                        <span className="text-[9px] font-semibold text-slate-400">{don.timestamp}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-[11px] mt-1">{don.donorName}</h4>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                        {don.weight}kg • <span className="font-semibold text-slate-600">{don.category}</span>
                      </p>
                    </div>
                    
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase ${
                      don.status === 'Aprobado' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : don.status === 'Retenido'
                        ? 'bg-red-50 text-red-700 border border-red-100'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {don.status}
                    </span>
                  </div>

                  {don.issueDetails && (
                    <div className="mt-3 p-2 bg-red-50/50 rounded-lg text-[9px] font-bold text-red-800 border border-red-100/50 flex items-start space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      <span>{don.issueDetails}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 text-[9px] font-bold uppercase tracking-wider">
                    <button className="text-slate-400 hover:text-slate-600">Ver Detalles</button>
                    <button className="text-blue-600 hover:text-blue-700">Comprobante</button>
                  </div>
                </div>
              ))}

              {filteredDonations.length === 0 && (
                <div className="text-center py-10 text-slate-400 font-bold text-[11px] border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  Ninguna donación coincide con el filtro.
                </div>
              )}
            </div>

            {/* Generate Report Button */}
            <button
              onClick={() => setShowImprimirBitacora(true)}
              className="w-full mt-4 h-11 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Generar Reporte de Turno</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
