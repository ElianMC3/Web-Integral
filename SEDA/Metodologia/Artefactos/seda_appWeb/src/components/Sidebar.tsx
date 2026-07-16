import { useStore } from '../context/useStore';
import { LayoutDashboard, Import, PackageOpen, Truck, Users, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setTab, currentUser, logout } = useStore();

  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Panel de Control Estratégico',
      icon: LayoutDashboard,
    },
    {
      id: 'reception',
      name: 'Recepción de Donaciones',
      icon: Import,
    },
    {
      id: 'packaging',
      name: 'Centro de Empacado y Clasificación',
      icon: PackageOpen,
    },
    {
      id: 'logistics',
      name: 'Gestión de Logística y Rutas',
      icon: Truck,
    },
    {
      id: 'users',
      name: 'Gestión de Usuarios',
      icon: Users,
    },
  ] as const;

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 z-20">
      {/* Branding */}
      <div className="p-5 border-b border-slate-100 flex items-center space-x-3">
        <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-md shadow-slate-950/20">
          <span className="font-extrabold text-sm tracking-wider">SD</span>
        </div>
        <div>
          <h1 className="font-extrabold text-slate-800 text-[15px] tracking-wide leading-none">SEDA</h1>
          <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Banco de Alimentos</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1">
        <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Principal
        </div>
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-left text-xs font-semibold tracking-wide transition-all duration-200 relative group ${isActive
                  ? 'text-blue-600 bg-blue-50/70 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
                  }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-blue-600 rounded-r-lg" />
                )}
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                />
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile & logout */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
            alt={currentUser?.name || 'Carlos'}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 shadow-sm"
          />
          <div className="text-left">
            <h4 className="font-bold text-slate-800 text-xs leading-tight">{currentUser?.name || 'Carlos Dispatcher'}</h4>
            <span className="text-[10px] text-slate-400 font-semibold">{currentUser?.office || 'Despensa Norte'}</span>
          </div>
        </div>
        <button
          onClick={logout}
          title="Cerrar sesión"
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
