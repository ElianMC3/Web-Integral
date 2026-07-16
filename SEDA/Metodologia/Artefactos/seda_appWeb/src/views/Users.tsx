import { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/useStore';
import {
  Users as UsersIcon, UserPlus, Search, Filter, ChevronLeft, ChevronRight,
  Trash2, X, Eye, EyeOff, Shield, CheckCircle, AlertCircle
} from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────────────────────────

const ROLES = [
  { value: '', label: 'Todos los roles' },
  { value: 'admin', label: 'Administrador', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'operador', label: 'Recepción', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'supervisor', label: 'Empacador', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'conductor', label: 'Repartidor', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
];

const OFFICES = ['Despensa Norte', 'Despensa Centro', 'Despensa Sur', 'Flota Transporte', 'Bodega Central'];

function getRoleBadge(role: string) {
  const found = ROLES.find(r => r.value === role);
  return found ? found : { label: role, color: 'bg-slate-100 text-slate-600 border-slate-200' };
}

function getRoleLabel(role: string) {
  const map: Record<string, string> = {
    admin: 'Administrador', operador: 'Recepción',
    supervisor: 'Empacador', conductor: 'Repartidor'
  };
  return map[role] || role;
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function getAvatarColor(id: number) {
  const colors = [
    'from-blue-500 to-blue-700', 'from-purple-500 to-purple-700',
    'from-emerald-500 to-emerald-700', 'from-amber-500 to-amber-700',
    'from-rose-500 to-rose-700', 'from-cyan-500 to-cyan-700',
  ];
  return colors[id % colors.length];
}

// ── Validation ────────────────────────────────────────────────────────────────

function validateField(name: string, value: string) {
  if (name === 'nombre' && value.trim().length < 3) return 'Ingresa al menos 3 caracteres';
  if (name === 'email') {
    if (!value.trim()) return 'El correo es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un correo electrónico válido';
  }
  if (name === 'password') {
    if (!value) return 'La contraseña es requerida';
    if (value.length < 6) return 'Mínimo 6 caracteres';
  }
  if (name === 'office' && !value) return 'Selecciona una sucursal';
  if (name === 'role' && !value) return 'Selecciona un rol';
  return '';
}

// ── New User Modal ────────────────────────────────────────────────────────────

function NuevoUsuarioModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { createUsuario } = useStore();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', office: '', role: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const fields = ['nombre', 'email', 'password', 'office', 'role'] as const;

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    fields.forEach(f => {
      const err = validateField(f, form[f]);
      if (err) newErrors[f] = err;
    });
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    // Map display role to DB role key
    const roleMap: Record<string, string> = {
      'Administrador': 'admin', 'Recepción': 'recepcion',
      'Empacador': 'empacador', 'Repartidor': 'repartidor'
    };
    const dbRole = roleMap[form.role] || form.role;

    setSaving(true);
    try {
      await createUsuario({ ...form, role: dbRole });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); setForm({ nombre: '', email: '', password: '', office: '', role: '' }); }, 1200);
    } catch (err) {
      setApiError((err as Error).message || 'Error al crear el usuario.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-50 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm shadow-blue-600/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Nuevo Usuario</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Registro de acceso al sistema</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs font-semibold text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{apiError}</span>
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs font-semibold text-emerald-600">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>¡Usuario creado exitosamente!</span>
            </div>
          )}

          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre Completo *</label>
            <input
              type="text" value={form.nombre} onChange={e => handleChange('nombre', e.target.value)}
              placeholder="Ej. María García López"
              className={`w-full h-10 px-4 rounded-xl border text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-none focus:border-blue-500 transition-colors ${errors.nombre ? 'border-red-300 bg-red-50/30' : 'border-slate-200'}`}
            />
            {errors.nombre && <p className="text-[10px] text-red-500 font-semibold">{errors.nombre}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Correo Electrónico *</label>
            <input
              type="email" value={form.email} onChange={e => handleChange('email', e.target.value)}
              placeholder="usuario@seda.org"
              className={`w-full h-10 px-4 rounded-xl border text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-none focus:border-blue-500 transition-colors ${errors.email ? 'border-red-300 bg-red-50/30' : 'border-slate-200'}`}
            />
            {errors.email && <p className="text-[10px] text-red-500 font-semibold">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contraseña *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} value={form.password}
                onChange={e => handleChange('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className={`w-full h-10 px-4 pr-10 rounded-xl border text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-none focus:border-blue-500 transition-colors ${errors.password ? 'border-red-300 bg-red-50/30' : 'border-slate-200'}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-semibold">{errors.password}</p>}
            {form.password && !errors.password && (
              <div className="flex items-center space-x-1.5 mt-1">
                <div className={`h-1 rounded-full flex-1 ${form.password.length >= 6 ? 'bg-emerald-400' : 'bg-slate-200'}`}></div>
                <div className={`h-1 rounded-full flex-1 ${form.password.length >= 8 ? 'bg-emerald-400' : 'bg-slate-200'}`}></div>
                <div className={`h-1 rounded-full flex-1 ${form.password.length >= 10 ? 'bg-emerald-400' : 'bg-slate-200'}`}></div>
                <span className="text-[9px] font-bold text-slate-400">{form.password.length >= 10 ? 'Fuerte' : form.password.length >= 8 ? 'Media' : 'Débil'}</span>
              </div>
            )}
          </div>

          {/* Office & Role */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sucursal *</label>
              <select value={form.office} onChange={e => handleChange('office', e.target.value)}
                className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-none focus:border-blue-500 transition-colors ${errors.office ? 'border-red-300' : 'border-slate-200'}`}>
                <option value="">Seleccionar...</option>
                {OFFICES.map(o => <option key={o}>{o}</option>)}
              </select>
              {errors.office && <p className="text-[10px] text-red-500 font-semibold">{errors.office}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rol *</label>
              <select value={form.role} onChange={e => handleChange('role', e.target.value)}
                className={`w-full h-10 px-3 rounded-xl border text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-none focus:border-blue-500 transition-colors ${errors.role ? 'border-red-300' : 'border-slate-200'}`}>
                <option value="">Seleccionar...</option>
                <option value="Administrador">Administrador</option>
                <option value="Recepción">Recepción</option>
                <option value="Empacador">Empacador</option>
                <option value="Repartidor">Repartidor</option>
              </select>
              {errors.role && <p className="text-[10px] text-red-500 font-semibold">{errors.role}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={saving || success}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/10 transition-all flex items-center space-x-2">
              {saving ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg><span>Guardando...</span></>
              ) : success ? (
                <><CheckCircle className="w-4 h-4" /><span>¡Listo!</span></>
              ) : (
                <><UserPlus className="w-4 h-4" /><span>Crear Usuario</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Users() {
  const { usuarios, usuariosPagination, fetchUsuarios, deleteUsuario } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const LIMIT = 8;

  useEffect(() => {
    fetchUsuarios({ page, search, role: roleFilter, limit: LIMIT });
  }, [page, roleFilter]);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      fetchUsuarios({ page: 1, search, role: roleFilter, limit: LIMIT });
    }, 300);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  const handleDelete = async (id: number, name: string) => {
    setDeletingId(id);
    await deleteUsuario(id);
    setDeletingId(null);
    setToast(`Usuario "${name}" eliminado correctamente.`);
    setTimeout(() => setToast(''), 3000);
  };

  const totalPages = usuariosPagination?.pages || 1;
  const totalUsers = usuariosPagination?.total || 0;

  // Counts per role
  const counts = { admin: 0, operador: 0, supervisor: 0, conductor: 0 };
  usuarios.forEach(u => { if (u.role in counts) (counts as Record<string, number>)[u.role]++; });

  return (
    <div className="p-8 space-y-8 animate-fade-in select-none">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-50 border border-emerald-200 rounded-xl shadow-lg text-xs font-bold text-emerald-700 flex items-center space-x-2 animate-slide-up">
          <CheckCircle className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      <NuevoUsuarioModal isOpen={showModal} onClose={() => { setShowModal(false); fetchUsuarios({ page, search, role: roleFilter, limit: LIMIT }); }} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Gestión de Usuarios</h2>
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">Control de acceso y roles del sistema</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/15 transition-all">
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { label: 'Total Usuarios', value: totalUsers, icon: UsersIcon, color: 'bg-blue-50 text-blue-600' },
          { label: 'Administradores', value: counts.admin, icon: Shield, color: 'bg-purple-50 text-purple-600' },
          { label: 'Recepción', value: counts.operador, icon: UsersIcon, color: 'bg-sky-50 text-sky-600' },
          { label: 'Repartidores', value: counts.conductor, icon: UsersIcon, color: 'bg-emerald-50 text-emerald-600' },
        ].map(card => (
          <div key={card.label} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${card.color}`}><card.icon className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{card.label}</p>
              <span className="text-xl font-black text-slate-800 tracking-tight">{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Panel */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Filters Bar */}
        <div className="p-5 border-b border-slate-50 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text" placeholder="Buscar por nombre, email o sucursal..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-400 transition-all placeholder:text-slate-400 text-slate-700"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <div className="flex flex-wrap gap-2">
              {ROLES.map(r => (
                <button key={r.value} onClick={() => { setRoleFilter(r.value); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${roleFilter === r.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="text-left py-3 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Usuario</th>
                <th className="text-left py-3 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Correo</th>
                <th className="text-left py-3 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sucursal</th>
                <th className="text-left py-3 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rol</th>
                <th className="text-left py-3 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registro</th>
                <th className="py-3 px-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                        <UsersIcon className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-xs font-bold text-slate-400">No se encontraron usuarios</p>
                      <p className="text-[10px] text-slate-300 font-semibold">Prueba con otros filtros o agrega un nuevo usuario</p>
                    </div>
                  </td>
                </tr>
              ) : (
                usuarios.map(user => {
                  const badge = getRoleBadge(user.role);
                  const isDeleting = deletingId === user.id;
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(user.id)} flex items-center justify-center text-white text-[10px] font-extrabold flex-shrink-0 shadow-sm`}>
                            {getInitials(user.nombre)}
                          </div>
                          <span className="text-xs font-extrabold text-slate-800">{user.nombre}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-[11px] font-semibold text-slate-500">{user.email}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-[11px] font-semibold text-slate-500">{user.office}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wide ${badge.color}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-[10px] font-semibold text-slate-400">{user.created_at?.slice(0, 10) || '—'}</span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleDelete(user.id, user.nombre)}
                          disabled={isDeleting}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50">
                          {isDeleting
                            ? <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                            : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-5 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[10px] font-semibold text-slate-400">
              Página <b className="text-slate-600">{page}</b> de <b className="text-slate-600">{totalPages}</b> — <b className="text-slate-600">{totalUsers}</b> usuarios totales
            </p>
            <div className="flex items-center space-x-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-xl text-[11px] font-bold transition-all ${p === page ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
