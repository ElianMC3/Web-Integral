import { useState } from 'react';
import { useStore } from '../context/useStore';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Thermometer, 
  AlertTriangle, 
  Search, 
  Filter, 
  Download
} from 'lucide-react';

export default function Logistics() {
  const { 
    logisticsUnits, 
    logisticsIncidences, 
    resolveLogisticsIncidence,
    historicalRoutes 
  } = useStore();

  const [historyQuery, setHistoryQuery] = useState('');

  // Handle reviewing/resolving active incidents
  const handleReviewIncident = (id: string, name: string) => {
    resolveLogisticsIncidence(id);
    alert(`Incidencia "${name}" revisada y autorizada.`);
  };

  // Filter history log
  const filteredHistory = historicalRoutes.filter(route => {
    if (!historyQuery) return true;
    const q = historyQuery.toLowerCase();
    return (
      route.driver.toLowerCase().includes(q) ||
      route.lote.toLowerCase().includes(q) ||
      route.details.toLowerCase().includes(q) ||
      route.statusBadge.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-8 space-y-8 animate-fade-in select-none">
      
      {/* Upper Grid: Units, Incidents and Load Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Active Units & Incidents */}
        <div className="space-y-8 lg:col-span-2">
          
          {/* Active Units Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unidades en Ruta</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {logisticsUnits.map((unit) => (
                <div key={unit.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl ${unit.type === 'Refrigerado' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-700'}`}>
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs leading-tight">Unidad {unit.id}</h4>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">{unit.type}</span>
                      </div>
                    </div>

                    {unit.statusBadge ? (
                      <span className="px-2 py-0.5 rounded-full text-[8.5px] font-extrabold bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
                        {unit.statusBadge}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[8.5px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                        En Ruta
                      </span>
                    )}
                  </div>

                  {/* Card Main Info */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50/60 p-3 rounded-2xl border border-slate-100">
                    <div className="text-left">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Conductor</span>
                      <p className="text-[11px] font-extrabold text-slate-700 mt-0.5">{unit.driver}</p>
                    </div>
                    <div className="text-left">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Capacidad</span>
                      <p className="text-[11px] font-extrabold text-slate-700 mt-0.5">{unit.capacity}</p>
                    </div>
                  </div>

                  {/* Progress Load Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
                      <span>Nivel de Carga</span>
                      <span>{unit.loadPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          unit.loadPercentage > 80 ? 'bg-amber-500' : 'bg-blue-600'
                        }`} 
                        style={{ width: `${unit.loadPercentage}%` }} 
                      />
                    </div>
                  </div>

                  {/* Dynamic extra info (Temp, Location, ETA) */}
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-50">
                    {unit.temp && (
                      <span className="flex items-center space-x-1 text-blue-600">
                        <Thermometer className="w-3.5 h-3.5" />
                        <span>Temp: {unit.temp}</span>
                      </span>
                    )}
                    {unit.location && (
                      <span className="flex items-center space-x-1 text-slate-600">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Ubicación: {unit.location}</span>
                      </span>
                    )}
                    {unit.eta && (
                      <span className="flex items-center space-x-1 text-slate-600 ml-auto">
                        <Clock className="w-3.5 h-3.5" />
                        <span>ETA: {unit.eta}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incidents Center */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-[#78281F] uppercase tracking-widest flex items-center space-x-1">
                  <span>🚨 Centro de Incidencias</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Alertas de transporte activas hoy</p>
              </div>
              <span className="px-2 py-0.5 bg-red-50 text-[#78281F] rounded-full text-[9px] font-black uppercase">
                {logisticsIncidences.filter(i => i.status === 'active').length} Activas
              </span>
            </div>

            <div className="space-y-3">
              {logisticsIncidences.map((inc) => {
                const isResolved = inc.status === 'reviewed';
                return (
                  <div 
                    key={inc.id} 
                    className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 ${
                      isResolved 
                        ? 'bg-slate-50/50 border-slate-200 opacity-60' 
                        : 'bg-red-50/40 border-red-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${isResolved ? 'bg-slate-200 text-slate-500' : 'bg-red-100 text-red-600'}`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className={`text-xs font-extrabold ${isResolved ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                          {inc.title}
                        </h4>
                        <span className="text-[9px] text-slate-400 font-bold">Vehículo: {inc.unit}</span>
                      </div>
                    </div>

                    <button
                      disabled={isResolved}
                      onClick={() => handleReviewIncident(inc.id, inc.title)}
                      className={`px-3 py-1.5 font-bold text-[10px] rounded-lg transition-all ${
                        isResolved 
                          ? 'bg-slate-100 text-slate-400 border border-slate-200' 
                          : 'bg-[#78281F] hover:bg-[#5E1F18] text-white shadow-sm'
                      }`}
                    >
                      {isResolved ? 'Revisado' : 'Revisar'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Pending Assignments */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5 flex flex-col h-[525px]">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Asignación de Cargas</h3>
            <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">12 Cargas Pendientes de Despacho</p>
          </div>

          <div className="flex-grow space-y-3 overflow-y-auto pr-0.5">
            {/* Lote 1 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">LOTE-9921</span>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-[8.5px] font-extrabold uppercase animate-pulse">
                  En Ruta
                </span>
              </div>
              <div className="text-[11px] font-semibold text-slate-600 space-y-1">
                <p><span className="text-slate-400 font-bold uppercase text-[9px] mr-1">Destino:</span> Zona Sur (Despensas comunitarias, Sector 4)</p>
                <p><span className="text-slate-400 font-bold uppercase text-[9px] mr-1">Fecha:</span> 12/05/2026</p>
                <p><span className="text-slate-400 font-bold uppercase text-[9px] mr-1">Canasta:</span> Perecederos</p>
              </div>
              <div className="border-t border-slate-100 pt-2 flex items-center space-x-2 text-[9px] font-bold text-slate-500">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>Asignado: Miguel Ángel (TR-01)</span>
              </div>
            </div>

            {/* Lote 2 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">LOTE-9922</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[8.5px] font-extrabold uppercase">
                  Asignado
                </span>
              </div>
              <div className="text-[11px] font-semibold text-slate-600 space-y-1">
                <p><span className="text-slate-400 font-bold uppercase text-[9px] mr-1">Destino:</span> Albergue San José, Centro</p>
                <p><span className="text-slate-400 font-bold uppercase text-[9px] mr-1">Fecha:</span> 13/05/2026</p>
                <p><span className="text-slate-400 font-bold uppercase text-[9px] mr-1">Canasta:</span> Secos</p>
              </div>
              <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[9px] font-bold">
                <span className="text-slate-400">Sin asignar vehículo</span>
                <button 
                  onClick={() => alert('Asignando transporte para LOTE-9922...')}
                  className="text-blue-600 hover:text-blue-700 uppercase"
                >
                  Asignar Unidad
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom section: Historical Log */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Registro Histórico de Rutas</h3>
            <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Auditoría del transporte de despensas</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search filter */}
            <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-3.5 h-3.5 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Buscar registros por lote, conductor o destino..."
                value={historyQuery}
                onChange={(e) => setHistoryQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 text-slate-700"
              />
            </div>

            <button className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition-all">
              <Filter className="w-3.5 h-3.5" />
              <span>Filtrar</span>
            </button>
            <button 
              onClick={() => alert('Exportando bitácora de logística a CSV...')}
              className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Historical List Items */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-0.5">
          {filteredHistory.map((route) => (
            <div 
              key={route.id} 
              className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="text-[11px] font-extrabold text-slate-800">{route.driver}</span>
                  <span className="text-[10px] text-slate-500 font-bold">{route.actionText}</span>
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{route.lote}</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-600">{route.details}</p>
                <div className="flex items-center space-x-2 text-[9px] font-semibold text-slate-400">
                  <span>📅 {route.date}</span>
                  <span>•</span>
                  <span>🕒 {route.time}</span>
                </div>
              </div>

              {/* Status Badges on the right */}
              <div className="flex items-center space-x-3">
                {route.extraBadge && (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[9px] font-bold uppercase tracking-wider">
                    {route.extraBadge}
                  </span>
                )}
                <span className={`px-2.5 py-1 border rounded-full text-[9px] font-extrabold uppercase tracking-wide ${route.statusColor}`}>
                  {route.statusBadge}
                </span>
              </div>
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="text-center py-8 text-slate-400 font-bold text-xs border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              Ningún registro de logística coincide con la búsqueda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
