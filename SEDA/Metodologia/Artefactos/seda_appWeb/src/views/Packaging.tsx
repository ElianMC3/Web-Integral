import { useState } from 'react';
import { useStore } from '../context/useStore';
import { 
  ClipboardList, 
  AlertOctagon, 
  Truck, 
  Users, 
  Filter, 
  Plus, 
  Printer,
  Barcode,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle,
  Package,
  Tag,
  User,
  Calendar,
  MapPin
} from 'lucide-react';

// ─── Modal: Nueva Tarea de Lote ──────────────────────────────────────────────
function NuevaTareaModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { fetchLotes } = useStore();
  const [form, setForm] = useState({
    titulo: '', lote: '', tipo: 'No Perecederos', peso: '',
    destino: '', responsable: '', prioridad: 'Normal',
    fecha: new Date().toISOString().split('T')[0], instrucciones: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const change = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      // Call the API directly to create the lote
      const token = localStorage.getItem('seda_token');
      const res = await fetch('/api/lotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: form.titulo,
          donor: form.destino || 'Sin especificar',
          weight: form.peso ? `${form.peso}kg` : 'Sin especificar',
          due_date: form.fecha,
          status: form.responsable ? 'Asignado' : 'Sin asignar',
          columna: 'PENDIENTE',
          assigned_to: form.responsable || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al crear tarea');
      await fetchLotes(); // Refresh kanban board
      onClose();
      setForm({ titulo: '', lote: '', tipo: 'No Perecederos', peso: '', destino: '', responsable: '', prioridad: 'Normal', fecha: new Date().toISOString().split('T')[0], instrucciones: '' });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
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
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Nueva Tarea de Lote</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Asignación al tablero operativo</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] font-bold text-red-700">
              ❌ {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {/* Título */}
            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1"><ClipboardList className="w-3 h-3" /><span>Título de la Tarea</span></label>
              <input required value={form.titulo} onChange={e => change('titulo', e.target.value)} placeholder="Ej. Clasificación Lote Frutas" className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50 placeholder:text-slate-300" />
            </div>

            {/* Número de lote */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1"><Barcode className="w-3 h-3" /><span>Número de Lote</span></label>
              <input required value={form.lote} onChange={e => change('lote', e.target.value)} placeholder="Ej. L-48291" maxLength={50} className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50 placeholder:text-slate-300" />
            </div>

            {/* Tipo */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1"><Tag className="w-3 h-3" /><span>Tipo de Producto</span></label>
              <select value={form.tipo} onChange={e => change('tipo', e.target.value)} className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50">
                <option>No Perecederos</option>
                <option>Perecederos</option>
                <option>Lácteos y Frío</option>
                <option>Frutas y Verduras</option>
                <option>Carnes y Embutidos</option>
              </select>
            </div>

            {/* Peso */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peso Estimado (kg)</label>
              <input required type="number" min="0" step="0.01" value={form.peso} onChange={e => change('peso', e.target.value)} 
                onKeyDown={(e) => {
                  if (!/^[0-9.]$/.test(e.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="0.00" className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50 placeholder:text-slate-300" />
            </div>

            {/* Prioridad */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prioridad</label>
              <div className="flex gap-2">
                {(['Normal', 'Alta', 'Urgente'] as const).map(p => (
                  <button key={p} type="button" onClick={() => change('prioridad', p)} className={`flex-1 py-2 rounded-lg text-[10px] font-bold border transition-all ${
                    form.prioridad === p
                      ? p === 'Urgente' ? 'bg-red-600 border-red-600 text-white' : p === 'Alta' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}>{p}</button>
                ))}
              </div>
            </div>

            {/* Destino */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1"><MapPin className="w-3 h-3" /><span>Destino / Despensa</span></label>
              <input required value={form.destino} onChange={e => change('destino', e.target.value)} placeholder="Ej. Despensa Norte" maxLength={100} className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50 placeholder:text-slate-300" />
            </div>

            {/* Responsable */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1"><User className="w-3 h-3" /><span>Responsable</span></label>
              <select value={form.responsable} onChange={e => change('responsable', e.target.value)} className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50">
                <option value="">Sin asignar</option>
                <option>Equipo Mesa 1</option>
                <option>Equipo Mesa 2</option>
                <option>Equipo Mesa 3</option>
                <option>Supervisor Carlos</option>
              </select>
            </div>

            {/* Fecha límite */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1"><Calendar className="w-3 h-3" /><span>Fecha Límite</span></label>
              <input required type="date" value={form.fecha} onChange={e => change('fecha', e.target.value)} className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50" />
            </div>

            {/* Instrucciones */}
            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Instrucciones Especiales</label>
              <textarea rows={2} value={form.instrucciones} onChange={e => change('instrucciones', e.target.value)} placeholder="Condiciones de manejo, temperatura requerida, etc." className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50 placeholder:text-slate-300 resize-none" />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2 border-t border-slate-50">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/10 transition-all flex items-center space-x-1.5">
              {saving ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg><span>Creando...</span></>
              ) : (
                <><CheckCircle className="w-4 h-4" /><span>Crear Tarea</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal: Imprimir Etiquetas ───────────────────────────────────────────────
function ImprimirEtiquetasModal({
  isOpen, onClose, destination, items, total
}: {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
  items: { id: string; category: string; weight: number }[];
  total: number;
}) {
  const [tamano, setTamano] = useState<'pequeño' | 'mediano' | 'grande'>('mediano');
  const [copias, setCopias] = useState(1);
  const [incluirQR, setIncluirQR] = useState(true);
  const [incluirFecha, setIncluirFecha] = useState(true);

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
              <h3 className="text-base font-bold text-slate-800">Imprimir Etiquetas</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Destino: {destination || 'Sin especificar'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Preview card */}
          <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Vista Previa</p>
                <h4 className="text-sm font-black text-white mt-0.5">{destination || 'DESPENSA DESTINO'}</h4>
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-lg">
                🏷️
              </div>
            </div>
            <div className="flex items-center space-x-4 text-[10px] font-bold text-slate-300 pt-1 border-t border-white/10">
              <span>{items.length} lotes</span>
              <span>•</span>
              <span>{total} kg total</span>
              <span>•</span>
              <span>{new Date().toLocaleDateString('es-MX')}</span>
            </div>
          </div>

          {/* Lotes incluidos */}
          {items.length > 0 && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lotes a Etiquetar ({items.length})</label>
              <div className="max-h-28 overflow-y-auto space-y-1.5 pr-0.5">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-semibold text-slate-600">
                    <span className="font-bold text-slate-800">{item.id}</span>
                    <span className="text-slate-400">{item.category}</span>
                    <span className="font-extrabold">{item.weight}kg</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tamaño de etiqueta */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tamaño de Etiqueta</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: 'pequeño', label: 'Pequeña', size: '5 × 3 cm' },
                { id: 'mediano', label: 'Mediana', size: '10 × 6 cm' },
                { id: 'grande', label: 'Grande', size: '15 × 10 cm' },
              ] as const).map(opt => (
                <button key={opt.id} type="button" onClick={() => setTamano(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    tamano === opt.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <p className={`text-[11px] font-bold ${tamano === opt.id ? 'text-blue-700' : 'text-slate-700'}`}>{opt.label}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{opt.size}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Copias + opciones */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Copias por Etiqueta</label>
              <div className="flex items-center space-x-3">
                <button type="button" onClick={() => setCopias(c => Math.max(1, c - 1))} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-slate-600 flex items-center justify-center">−</button>
                <span className="text-sm font-black text-slate-800 w-4 text-center">{copias}</span>
                <button type="button" onClick={() => setCopias(c => Math.min(10, c + 1))} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-slate-600 flex items-center justify-center">+</button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Opciones</label>
              <div className="space-y-1.5">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={incluirQR} onChange={e => setIncluirQR(e.target.checked)} className="rounded accent-blue-600 w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold text-slate-600">Incluir código QR</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={incluirFecha} onChange={e => setIncluirFecha(e.target.checked)} className="rounded accent-blue-600 w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold text-slate-600">Incluir fecha de empaque</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2 border-t border-slate-50">
            <button onClick={onClose} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all">
              Cancelar
            </button>
            <button
              onClick={() => {
                alert(`🖨️ Imprimiendo ${items.length > 0 ? items.length : 1} etiqueta(s) en tamaño ${tamano}, ${copias} copia(s) c/u.`);
                onClose();
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/10 transition-all flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir {items.length > 0 ? items.length : ''} Etiqueta{items.length !== 1 ? 's' : ''}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal: Asignar Responsable ──────────────────────────────────────────────
function AsignarResponsableModal({ isOpen, onClose, lotes }: { isOpen: boolean; onClose: () => void; lotes: number }) {
  const [responsable, setResponsable] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-50 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm shadow-blue-600/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Asignar Responsable</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">A bulto consolidado</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <User className="w-3 h-3" /><span>Responsable / Transportista</span>
            </label>
            <select required value={responsable} onChange={e => setResponsable(e.target.value)} className="w-full h-10 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700 bg-slate-50/50">
              <option value="">Selecciona un responsable...</option>
              <option>Equipo Logística 1</option>
              <option>Equipo Logística 2</option>
              <option>Transportista A (Refrigerado)</option>
              <option>Transportista B (Seco)</option>
            </select>
          </div>

          <p className="text-[10px] text-slate-500 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
            Se asignarán <b>{lotes}</b> lote(s) al responsable seleccionado.
          </p>

          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={saving || !responsable} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/10 transition-all flex items-center space-x-1.5">
              {saving ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg><span>Asignando...</span></>
              ) : (
                <><CheckCircle className="w-4 h-4" /><span>Asignar</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Packaging() {
  const { 
    kanbanTasks, 
    moveKanbanTask,
    consolidationDestination,
    setConsolidationDestination,
    consolidationBarcode,
    setConsolidationBarcode,
    consolidatedItems,
    addConsolidationItem,
    clearConsolidation
  } = useStore();

  // Modal states
  const [showNuevaTarea, setShowNuevaTarea] = useState(false);
  const [showImprimirEtiquetas, setShowImprimirEtiquetas] = useState(false);
  const [showAsignarResponsable, setShowAsignarResponsable] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const [criticalAlerts, setCriticalAlerts] = useState([
    { id: 'L-882', name: 'Lácteos - Lote 882', timer: 'Vence en 2h', desc: 'Mesa de clasificación 2 detenida.', severity: 'red' },
    { id: 'L-890', name: 'Pollo Fresco - Lote 890', timer: 'Temp. Alta', desc: 'Cámara 3 reporta 6°C (Límite 4°C).', severity: 'red' }
  ]);

  const handleResolveCriticalAlert = (id: string, action: string) => {
    setCriticalAlerts(prev => prev.filter(a => a.id !== id));
    alert(`Alerta ${id} resuelta con acción: ${action}`);
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consolidationBarcode.trim()) return;
    const randomWeight = Math.floor(10 + Math.random() * 80);
    const categories = ['No Perecederos', 'Perecederos', 'Lácteos y Frío'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    addConsolidationItem({ id: consolidationBarcode.toUpperCase(), category: randomCategory, weight: randomWeight });
    setConsolidationBarcode('');
  };

  const totalConsolidatedWeight = consolidatedItems.reduce((sum, item) => sum + item.weight, 0);

  const handleDragStart = (e: React.DragEvent, id: string) => { e.dataTransfer.setData('text/plain', id); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = (e: React.DragEvent, targetColumn: 'PENDIENTE' | 'EN_PROCESO' | 'CONTROL_CALIDAD') => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) moveKanbanTask(id, targetColumn);
  };

  const columns: { id: 'PENDIENTE' | 'EN_PROCESO' | 'CONTROL_CALIDAD'; label: string; count: number; colorClass: string }[] = [
    { id: 'PENDIENTE', label: 'PENDIENTE', count: 12, colorClass: 'border-t-2 border-red-500' },
    { id: 'EN_PROCESO', label: 'EN PROCESO', count: 5, colorClass: 'border-t-2 border-blue-500' },
    { id: 'CONTROL_CALIDAD', label: 'CONTROL CALIDAD', count: 3, colorClass: 'border-t-2 border-amber-500' }
  ];

  return (
    <>
      {/* Modals */}
      <NuevaTareaModal isOpen={showNuevaTarea} onClose={() => setShowNuevaTarea(false)} />
      <ImprimirEtiquetasModal
        isOpen={showImprimirEtiquetas}
        onClose={() => setShowImprimirEtiquetas(false)}
        destination={consolidationDestination}
        items={consolidatedItems}
        total={totalConsolidatedWeight}
      />
      <AsignarResponsableModal 
        isOpen={showAsignarResponsable}
        onClose={() => {
          setShowAsignarResponsable(false);
          setSuccessToast('✅ Responsable asignado exitosamente al bulto.');
          setTimeout(() => setSuccessToast(''), 3000);
          clearConsolidation(); // Limpia los items después de asignar
        }}
        lotes={consolidatedItems.length}
      />

      <div className="p-8 space-y-8 animate-fade-in select-none">
        
        {/* Toast feedback */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-50 border border-emerald-200 rounded-xl shadow-lg shadow-emerald-500/10 text-xs font-bold text-emerald-700 flex items-center space-x-2 animate-slide-up">
            <span>{successToast}</span>
          </div>
        )}
        
        {/* Top operational summary metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ClipboardList className="w-5 h-5" /></div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Tareas Activas</h4>
              <span className="text-xl font-black text-slate-800 tracking-tight">142</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertOctagon className="w-5 h-5" /></div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Perecederos Críticos</h4>
              <span className="text-xl font-black text-slate-800 tracking-tight">18</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Truck className="w-5 h-5" /></div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Listos (Hoy)</h4>
              <span className="text-xl font-black text-slate-800 tracking-tight">45</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-800 rounded-xl"><Users className="w-5 h-5" /></div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Personal Activo</h4>
              <span className="text-xl font-black text-slate-800 tracking-tight">24/30</span>
            </div>
          </div>
        </div>

        {/* Main Operations Board Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Kanban Board (3 columns width) */}
          <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-50 pb-4">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Tablero Operativo</h3>
              
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition-all">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filtrar</span>
                </button>
                {/* ── Nueva Tarea → abre modal ── */}
                <button
                  onClick={() => setShowNuevaTarea(true)}
                  className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nueva Tarea</span>
                </button>
                {/* ── Generar Despensa/Lote → abre modal ── */}
                <button
                  onClick={() => setShowNuevaTarea(true)}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Generar Despensa/Lote</span>
                </button>
              </div>
            </div>

            {/* Kanban columns grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {columns.map((col) => {
                const colTasks = kanbanTasks.filter(t => t.column === col.id);
                
                return (
                  <div 
                    key={col.id} 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className={`bg-slate-50/70 p-4 rounded-2xl min-h-[500px] flex flex-col space-y-4 border border-slate-100 transition-colors duration-200 ${col.colorClass}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">{col.label}</span>
                      <span className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-[10px] text-slate-600 font-extrabold">{colTasks.length}</span>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[460px] pr-0.5">
                      {colTasks.map((task) => (
                        <div 
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-400 transition-all group"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] font-bold text-slate-400">{task.id}</span>
                              <h4 className="font-extrabold text-slate-800 text-[11px] mt-0.5 group-hover:text-blue-600 transition-colors">{task.title}</h4>
                              <span className="text-[9px] text-slate-400 font-semibold mt-0.5 block">{task.donor}</span>
                            </div>
                            <span className="text-slate-300 font-black text-sm select-none">⋮</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 mt-3">
                            {task.status === 'Frío' && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-bold uppercase tracking-wider">❄️ Frío</span>}
                            {task.status === 'Asignado' && <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[8px] font-bold uppercase tracking-wider">Asignado</span>}
                            {task.status === 'Esperando Inspector' && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[8px] font-bold uppercase tracking-wider">Esperando Inspector</span>}
                            {task.status === 'Sin asignar' && <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-bold uppercase tracking-wider">Sin asignar</span>}
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 font-extrabold text-[8px] rounded uppercase tracking-wider ml-auto">{task.weight}</span>
                          </div>

                          {task.progress !== undefined && (
                            <div className="mt-3 space-y-1">
                              <div className="flex justify-between items-center text-[8px] font-bold text-slate-400">
                                <span>Progreso</span>
                                <span>{task.progress}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${task.progress}%` }} />
                              </div>
                              <span className="text-[8px] text-slate-500 font-bold block pt-0.5">{task.location}</span>
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50 text-[9px] font-bold text-slate-400">
                            <span>📅 {task.dueDate}</span>
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {col.id !== 'PENDIENTE' && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); moveKanbanTask(task.id, col.id === 'CONTROL_CALIDAD' ? 'EN_PROCESO' : 'PENDIENTE'); }}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-500"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                              )}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addConsolidationItem({
                                    id: task.id,
                                    category: task.title,
                                    weight: parseInt(task.weight) || 0
                                  });
                                }}
                                className="p-1 hover:bg-slate-100 rounded text-blue-500"
                                title="Añadir a Consolidación Rápida"
                              >
                                <Package className="w-3 h-3" />
                              </button>
                              {col.id !== 'CONTROL_CALIDAD' && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); moveKanbanTask(task.id, col.id === 'PENDIENTE' ? 'EN_PROCESO' : 'CONTROL_CALIDAD'); }}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-500"
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar - Critical Alerts & Consolidator */}
          <div className="space-y-6">
            
            {/* Critical Alerts */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <h3 className="text-xs font-extrabold text-[#78281F] uppercase tracking-widest flex items-center space-x-1">
                  <span>⚠️ Perecederos Críticos</span>
                </h3>
                <span className="w-4 h-4 bg-red-100 text-[#78281F] rounded-full flex items-center justify-center text-[9px] font-black">{criticalAlerts.length}</span>
              </div>

              <div className="space-y-3">
                {criticalAlerts.map(alert => (
                  <div key={alert.id} className="p-3 bg-red-50/50 border border-red-100 rounded-xl space-y-2.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-red-900 text-[10px]">{alert.name}</h4>
                        <span className="text-[9px] font-extrabold text-red-600">{alert.timer}</span>
                      </div>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-600 leading-tight">{alert.desc}</p>
                    
                    <div className="flex gap-2">
                      {alert.id === 'L-882' ? (
                        <>
                          <button onClick={() => handleResolveCriticalAlert(alert.id, 'Priorizado')} className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[9px] rounded-lg transition-all">Priorizar</button>
                          <button onClick={() => handleResolveCriticalAlert(alert.id, 'Reclasificado')} className="flex-1 py-1.5 bg-white hover:bg-slate-100 text-blue-600 border border-blue-200 font-bold text-[9px] rounded-lg transition-all">Reclasificar</button>
                        </>
                      ) : (
                        <button onClick={() => handleResolveCriticalAlert(alert.id, 'Movido a Cámara 1')} className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[9px] rounded-lg transition-all">Mover a Cámara 1</button>
                      )}
                    </div>
                  </div>
                ))}
                
                {criticalAlerts.length === 0 && (
                  <div className="text-center py-4 text-slate-400 text-[10px] font-bold border-2 border-dashed border-slate-100 rounded-xl">
                    Sin alertas críticas activas.
                  </div>
                )}
              </div>
            </div>

            {/* Consolidación Rápida */}
            <div 
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4"
              onDragOver={handleDragOver}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData('text/plain');
                if (id) {
                  const task = kanbanTasks.find(t => t.id === id);
                  if (task) {
                    addConsolidationItem({
                      id: task.id,
                      category: task.title,
                      weight: parseInt(task.weight) || 0
                    });
                  }
                }
              }}
            >
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-2">
                Consolidación Rápida
              </h3>

              <form onSubmit={handleBarcodeSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Destino / Despensa</label>
                  <input
                    type="text" value={consolidationDestination}
                    onChange={(e) => setConsolidationDestination(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Escanear Lote a Consolidar</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-400"><Barcode className="w-4 h-4" /></span>
                    <input
                      type="text" placeholder="Código de barras..."
                      value={consolidationBarcode}
                      onChange={(e) => setConsolidationBarcode(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 text-xs font-semibold text-slate-700"
                    />
                  </div>
                  <span className="text-[8px] text-slate-400 leading-none block">Escribe código y pulsa Enter</span>
                </div>
              </form>

              {/* Bulto actual list */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 border-b border-slate-100 pb-1.5">
                  <span>Bulto Actual ({consolidationDestination})</span>
                  <button onClick={clearConsolidation} className="text-slate-400 hover:text-red-500 font-semibold">Limpiar</button>
                </div>

                <div className="space-y-1 max-h-[140px] overflow-y-auto pr-0.5">
                  {consolidatedItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[10px] font-semibold text-slate-600">
                      <span>{item.id} <span className="text-[8px] text-slate-400">({item.category})</span></span>
                      <span className="font-extrabold">{item.weight}kg</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-800 border-t border-slate-100 pt-2">
                  <span>Total</span>
                  <span>{totalConsolidatedWeight}kg</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                {/* ── Imprimir Etiquetas → abre modal ── */}
                <button 
                  onClick={() => setShowImprimirEtiquetas(true)}
                  className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Etiquetas</span>
                </button>

                <button 
                  onClick={() => setShowAsignarResponsable(true)}
                  disabled={consolidatedItems.length === 0}
                  className="w-full h-10 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5"
                >
                  <UserPlus className="w-4 h-4 text-slate-400" />
                  <span>Asignar Responsable</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
