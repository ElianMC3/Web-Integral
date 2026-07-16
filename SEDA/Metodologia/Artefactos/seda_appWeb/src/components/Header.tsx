import { useStore } from '../context/useStore';
import { Search, Bell } from 'lucide-react';

export default function Header() {
  const { activeTab, operationalAlerts } = useStore();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Panel de Control Estratégico';
      case 'reception':
        return 'Recepción de Donaciones';
      case 'packaging':
        return 'Centro de Empacado y Clasificación';
      case 'logistics':
        return 'Gestión de Logística y Rutas';
      case 'users':
        return 'Gestión de Usuarios';
      default:
        return 'SEDA';
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'logistics':
        return 'Buscar vehículos, rutas...';
      case 'packaging':
        return 'Buscar tareas, lotes...';
      case 'reception':
      case 'dashboard':
      default:
        return 'Buscar donantes, rutas...';
    }
  };

  const activeAlertsCount = operationalAlerts.filter(a => !a.resolved).length;

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-10">
      {/* Title */}
      <h2 className="font-extrabold text-slate-800 text-lg tracking-tight">
        {getPageTitle()}
      </h2>

      {/* Global Actions */}
      <div className="flex items-center space-x-6">
        {/* Search Bar */}
        <div className="relative w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </span>
          <input
            type="search"
            placeholder={getSearchPlaceholder()}
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 text-slate-700"
          />
        </div>

        {/* Alerts Bell */}
        <div className="relative">
          <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all relative">
            <Bell className="w-5 h-5" />
            {activeAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border border-white flex items-center justify-center text-[9px] text-white font-extrabold animate-pulse">
                {activeAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
