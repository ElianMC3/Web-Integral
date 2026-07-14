import { useState, useEffect } from 'react';
import { useStore } from '../context/useStore';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Thermometer, 
  AlertTriangle, 
  Search, 
  Filter, 
  Download,
  Plus,
  X,
  Star,
  CheckCircle
} from 'lucide-react';

export default function Logistics() {
  const { 
    logisticsUnits, 
    logisticsIncidences, 
    resolveLogisticsIncidence,
    calculateRoute,
    historicalRoutes 
  } = useStore();

  // Estado local para el historial de rutas (para agregar nuevas)
  const [localHistoricalRoutes, setLocalHistoricalRoutes] = useState<any[]>([]);

  // Inicializar con las rutas históricas del store
  useEffect(() => {
    setLocalHistoricalRoutes(historicalRoutes);
  }, [historicalRoutes]);

  const [routeOrigin, setRouteOrigin] = useState('');
  const [routeDestination, setRouteDestination] = useState('');
  const [routeResult, setRouteResult] = useState<any>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [historyQuery, setHistoryQuery] = useState('');
  
  // Estados para el nuevo modal de agregar ruta
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedOriginState, setSelectedOriginState] = useState('');
  const [selectedOriginCity, setSelectedOriginCity] = useState('');

  // Estado para el toast de confirmación
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastDestinations, setToastDestinations] = useState<string[]>([]);
  const [toastOrigin, setToastOrigin] = useState('');

  // Datos de estados y ciudades de México
  const statesData = {
    'Aguascalientes': ['Aguascalientes'],
    'Baja California': ['Mexicali', 'Tijuana', 'Ensenada', 'Rosarito', 'Tecate'],
    'Baja California Sur': ['La Paz', 'Los Cabos', 'Comondú', 'Mulegé', 'Loreto'],
    'Campeche': ['Campeche', 'Ciudad del Carmen', 'Champotón', 'Escárcega'],
    'Chiapas': ['Tuxtla Gutiérrez', 'San Cristóbal de las Casas', 'Comitán', 'Tapachula', 'Palenque'],
    'Chihuahua': ['Chihuahua', 'Ciudad Juárez', 'Delicias', 'Cuauhtémoc', 'Parral'],
    'Coahuila': ['Saltillo', 'Torreón', 'Monclova', 'Piedras Negras', 'Acuña'],
    'Colima': ['Colima', 'Manzanillo', 'Tecomán', 'Villa de Álvarez'],
    'Ciudad de México': ['Álvaro Obregón', 'Azcapotzalco', 'Benito Juárez', 'Coyoacán', 'Cuajimalpa', 'Cuauhtémoc', 'Gustavo A. Madero', 'Iztacalco', 'Iztapalapa', 'La Magdalena Contreras', 'Miguel Hidalgo', 'Milpa Alta', 'Tláhuac', 'Tlalpan', 'Venustiano Carranza', 'Xochimilco'],
    'Durango': ['Durango', 'Gómez Palacio', 'Lerdo', 'Santiago Papasquiaro'],
    'Estado de México': ['Toluca', 'Ecatepec', 'Nezahualcóyotl', 'Naucalpan', 'Tlalnepantla', 'Atizapán', 'Cuautitlán', 'Chimalhuacán', 'Valle de Chalco', 'Ixtapaluca'],
    'Guanajuato': ['León', 'Irapuato', 'Celaya', 'Guanajuato', 'Silao', 'Salamanca'],
    'Guerrero': ['Acapulco', 'Chilpancingo', 'Iguala', 'Zihuatanejo', 'Taxco'],
    'Hidalgo': ['Pachuca', 'Tulancingo', 'Ixmiquilpan', 'Actopan', 'Tizayuca'],
    'Jalisco': ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Tonalá', 'Puerto Vallarta', 'Lagos de Moreno'],
    'Michoacán': ['Morelia', 'Uruapan', 'Zamora', 'Lázaro Cárdenas', 'Apatzingán', 'Zitácuaro'],
    'Morelos': ['Cuernavaca', 'Jiutepec', 'Cuautla', 'Temixco', 'Yautepec'],
    'Nayarit': ['Tepic', 'Ixtlán del Río', 'Tuxpan', 'Santiago Ixcuintla'],
    'Nuevo León': ['Monterrey', 'Guadalupe', 'San Nicolás', 'Santa Catarina', 'Apodaca', 'Escobedo'],
    'Oaxaca': ['Oaxaca', 'Juchitán', 'Salina Cruz', 'Tuxtepec', 'Huajuapan', 'Tehuantepec'],
    'Puebla': ['Puebla', 'Tehuacán', 'Atlixco', 'San Martín Texmelucan', 'Cholula'],
    'Querétaro': ['Querétaro', 'San Juan del Río', 'Corregidora', 'El Marqués'],
    'Quintana Roo': ['Cancún', 'Playa del Carmen', 'Chetumal', 'Cozumel', 'Tulum'],
    'San Luis Potosí': ['San Luis Potosí', 'Ciudad Valles', 'Matehuala', 'Rioverde'],
    'Sinaloa': ['Culiacán', 'Mazatlán', 'Los Mochis', 'Guasave', 'Navolato'],
    'Sonora': ['Hermosillo', 'Obregón', 'Nogales', 'San Luis Río Colorado', 'Guaymas'],
    'Tabasco': ['Villahermosa', 'Cárdenas', 'Comalcalco', 'Macuspana', 'Cunduacán'],
    'Tamaulipas': ['Reynosa', 'Matamoros', 'Nuevo Laredo', 'Ciudad Victoria', 'Tampico'],
    'Tlaxcala': ['Tlaxcala', 'Apizaco', 'Huamantla', 'San Pablo del Monte'],
    'Veracruz': ['Xalapa', 'Veracruz', 'Córdoba', 'Orizaba', 'Coatzacoalcos', 'Minatitlán', 'Poza Rica', 'Tuxpan', 'Boca del Río', 'Martínez de la Torre'],
    'Yucatán': ['Mérida', 'Valladolid', 'Tizimín', 'Kanasín', 'Progreso'],
    'Zacatecas': ['Zacatecas', 'Guadalupe', 'Fresnillo', 'Jerez', 'Calera']
  };

  // Pueblos Mágicos por estado
  const magicalTownsByState: {[key: string]: string[]} = {
    'Jalisco': ['Tequila', 'San Sebastián del Oeste', 'Mascota', 'Tapalpa', 'Mazamitla'],
    'Nuevo León': ['Santiago', 'Linares', 'Montemorelos'],
    'Veracruz': ['Coatepec', 'Xico', 'Naolinco', 'Orizaba', 'Córdoba', 'Zongolica'],
    'Puebla': ['Cuetzalan', 'Zacatlán', 'Chignahuapan', 'Atlixco'],
    'Guanajuato': ['Guanajuato', 'San Miguel de Allende', 'Dolores Hidalgo', 'Mineral de Pozos'],
    'Querétaro': ['Tequisquiapan', 'Bernal', 'San Joaquín', 'Amealco'],
    'San Luis Potosí': ['Real de Catorce', 'Xilitla', 'Aquismón'],
    'Zacatecas': ['Sombrerete', 'Jerez', 'Pinos', 'Sain Alto'],
    'Durango': ['Mapimí', 'Nombre de Dios', 'Pánuco'],
    'Chihuahua': ['Creel', 'Batopilas', 'Casas Grandes', 'San Francisco de Borja'],
    'Coahuila': ['Parras de la Fuente', 'Viesca', 'Cuatro Ciénegas'],
    'Michoacán': ['Pátzcuaro', 'Tzintzuntzan', 'Santa Clara del Cobre', 'Cuitzeo'],
    'Estado de México': ['Valle de Bravo', 'Teotihuacán', 'El Oro', 'Tepotzotlán'],
    'Morelos': ['Tepoztlán', 'Tlayacapan', 'Tehuitzingo', 'Yecapixtla'],
    'Guerrero': ['Taxco', 'Chilapa', 'Zihuatanejo'],
    'Oaxaca': ['Mitla', 'Teotitlán del Valle', 'Capulálpam', 'San Pablo Villa de Mitla'],
    'Chiapas': ['San Juan Chamula', 'Zinacantán', 'Comitán', 'Chiapa de Corzo'],
    'Yucatán': ['Valladolid', 'Izamal', 'Ticul', 'Muna', 'Maní'],
    'Quintana Roo': ['Tulum', 'Bacalar', 'Cozumel', 'Isla Mujeres'],
    'Baja California': ['Valle de Guadalupe', 'San Vicente', 'La Misión'],
    'Baja California Sur': ['Todos Santos', 'El Triunfo', 'San José del Cabo'],
    'Sonora': ['Álamos', 'Ures', 'Bavispe'],
    'Sinaloa': ['El Fuerte', 'Mocorito', 'Cosalá'],
    'Nayarit': ['San Blas', 'Compostela', 'Aticama'],
    'Colima': ['Comala', 'Suchitlán', 'Manzanillo'],
    'Hidalgo': ['Real del Monte', 'Huasca de Ocampo', 'Atotonilco', 'Mineral del Chico'],
    'Tlaxcala': ['Huamantla', 'Contla', 'Santa Cruz', 'Tlaxco'],
    'Aguascalientes': ['San José de Gracia', 'Tepezalá', 'Calvillo'],
    'Campeche': ['Champotón', 'Isla Arena', 'Palizada'],
    'Tabasco': ['Comalcalco', 'Teapa', 'Jalapa'],
    'Tamaulipas': ['Tula', 'Ocampo', 'Jaumave'],
  };

  const states = Object.keys(statesData).sort();

  // Función para obtener Pueblos Mágicos según el estado
  const getMagicalTownsByState = (state: string) => {
    return magicalTownsByState[state] || [];
  };

  // Efecto para ocultar el toast después de 5 segundos
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Handle reviewing/resolving active incidents
  const handleReviewIncident = (id: string, name: string) => {
    resolveLogisticsIncidence(id);
    alert(`Incidencia "${name}" revisada y autorizada.`);
  };

  const handleCalculateRoute = async () => {
    if (!routeOrigin.trim() || !routeDestination.trim()) {
      setRouteError('Ingresa coordenadas de origen y destino.');
      setRouteResult(null);
      return;
    }

    setRouteLoading(true);
    setRouteError(null);
    setRouteResult(null);

    const response = await calculateRoute(routeOrigin.trim(), routeDestination.trim());
    setRouteLoading(false);

    if (!response || !response.success) {
      setRouteError(response?.message || 'No se pudo calcular la ruta.');
      return;
    }

    setRouteResult(response.data);
  };

  // Filtrar historial (usando el estado local)
  const filteredHistory = localHistoricalRoutes.filter(route => {
    if (!historyQuery) return true;
    const q = historyQuery.toLowerCase();
    return (
      route.driver.toLowerCase().includes(q) ||
      route.lote.toLowerCase().includes(q) ||
      route.details.toLowerCase().includes(q) ||
      route.statusBadge.toLowerCase().includes(q)
    );
  });

  // Función para agregar destino
  const handleAddDestination = () => {
    if (selectedCity.trim() && selectedState.trim()) {
      const destination = `${selectedCity}, ${selectedState}`;
      if (!selectedDestinations.includes(destination)) {
        setSelectedDestinations([...selectedDestinations, destination]);
      }
      setSelectedCity('');
      setSelectedState('');
    }
  };

  // Función para agregar Pueblo Mágico como destino
  const handleAddMagicalTown = (town: string) => {
    const destination = `⭐ ${town} (${selectedCity || 'Región'}, ${selectedState})`;
    if (!selectedDestinations.includes(destination)) {
      setSelectedDestinations([...selectedDestinations, destination]);
    }
  };

  // Función para eliminar destino
  const handleRemoveDestination = (dest: string) => {
    setSelectedDestinations(selectedDestinations.filter(d => d !== dest));
  };

  // Función para generar ID único
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  };

  // Función para guardar la ruta y agregarla al historial
  const handleSaveRoute = () => {
    if (!selectedOriginCity.trim() || !selectedOriginState.trim()) {
      alert('Debes seleccionar una ciudad de origen.');
      return;
    }
    
    if (selectedDestinations.length === 0) {
      alert('Debes seleccionar al menos un destino.');
      return;
    }
    
    const origin = `${selectedOriginCity}, ${selectedOriginState}`;
    
    // Crear nueva entrada para el historial
    const now = new Date();
    const fecha = now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const hora = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Generar número de lote aleatorio
    const loteNumber = Math.floor(1000 + Math.random() * 9000);
    const lote = `LOTE-${loteNumber}`;
    
    const newRoute = {
      id: generateId(),
      driver: 'Carlos Dispatcher',
      actionText: 'creó nueva ruta',
      lote: lote,
      details: `📍 ${origin} → ${selectedDestinations.length} destinos: ${selectedDestinations.join(', ')}`,
      date: fecha,
      time: hora,
      statusBadge: 'Programada',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-100',
      extraBadge: 'Nueva',
      origin: origin,
      destinations: [...selectedDestinations]
    };
    
    // Agregar al historial local (al principio para que aparezca primero)
    setLocalHistoricalRoutes([newRoute, ...localHistoricalRoutes]);
    
    // Mostrar toast en lugar de alert
    setToastOrigin(origin);
    setToastDestinations(selectedDestinations);
    setToastMessage('Ruta guardada con éxito');
    setShowToast(true);
    
    // Cerrar modal y limpiar
    setShowRouteModal(false);
    setSelectedDestinations([]);
    setSelectedCity('');
    setSelectedState('');
    setSelectedOriginCity('');
    setSelectedOriginState('');
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in select-none">
      
      {/* Header con el botón Agregar Ruta en la esquina superior derecha */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Gestión de Logística y Rutas</h2>
        <button
          onClick={() => setShowRouteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#78281F] hover:bg-[#5E1F18] text-white rounded-2xl text-xs font-black uppercase transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Agregar Ruta
        </button>
      </div>
      
      {/* Toast de confirmación */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl border border-green-100 overflow-hidden">
            {/* Header del toast */}
            <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 rounded-full p-1.5">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-green-800">✅ {toastMessage}</h4>
                  <p className="text-[10px] text-green-600 font-semibold">OSRM + Street Routing</p>
                </div>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contenido del toast */}
            <div className="px-6 py-4 space-y-3">
              {/* Origen */}
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[9px] font-bold uppercase text-slate-400">Origen</span>
                  <p className="text-sm font-bold text-slate-800">{toastOrigin}</p>
                </div>
              </div>

              {/* Destinos */}
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-[9px] font-bold uppercase text-slate-400">Destinos ({toastDestinations.length})</span>
                  <div className="mt-1 space-y-1">
                    {toastDestinations.map((dest, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
                        <span className="text-[10px] font-bold text-blue-500 w-4">{index + 1}.</span>
                        <span className="font-medium">{dest}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del toast */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[8px] text-slate-400 font-bold uppercase">
                Cerrando en 5 segundos...
              </span>
              <button
                onClick={() => setShowToast(false)}
                className="text-[10px] font-bold text-[#78281F] hover:text-[#5E1F18] transition-colors uppercase"
              >
                Cerrar ahora
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Unidades en Ruta */}
        <div className="space-y-4 lg:col-span-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unidades en Ruta</h3>
          
          <div className="grid grid-cols-1 gap-6">
            {logisticsUnits.map((unit) => (
              <div key={unit.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
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

        {/* Centro de Incidencias y Asignación de Cargas */}
        <div className="space-y-8 lg:col-span-1">
          {/* Centro de Incidencias */}
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

          {/* Asignación de Cargas */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5 flex flex-col h-[400px]">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Asignación de Cargas</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">12 Cargas Pendientes de Despacho</p>
            </div>

            <div className="flex-grow space-y-3 overflow-y-auto pr-0.5">
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
      </div>

      {/* Historial de Rutas */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Registro Histórico de Rutas</h3>
            <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Auditoría del transporte de despensas</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-3.5 h-3.5 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Buscar vehículos, rutas..."
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

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-0.5">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((route) => (
              <div 
                key={route.id} 
                className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-200 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="text-[11px] font-extrabold text-slate-800">{route.driver}</span>
                    <span className="text-[10px] text-slate-500 font-bold">{route.actionText}</span>
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{route.lote}</span>
                    {route.extraBadge === 'Nueva' && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 rounded text-[8px] font-bold uppercase animate-pulse">
                        ¡Nueva!
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600">{route.details}</p>
                  <div className="flex items-center space-x-2 text-[9px] font-semibold text-slate-400">
                    <span>📅 {route.date}</span>
                    <span>•</span>
                    <span>🕒 {route.time}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {route.extraBadge && route.extraBadge !== 'Nueva' && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[9px] font-bold uppercase tracking-wider">
                      {route.extraBadge}
                    </span>
                  )}
                  <span className={`px-2.5 py-1 border rounded-full text-[9px] font-extrabold uppercase tracking-wide ${route.statusColor}`}>
                    {route.statusBadge}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 font-bold text-xs border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              Ningún registro de logística coincide con la búsqueda.
            </div>
          )}
        </div>
      </div>

      {/* Modal para Agregar Ruta */}
      {showRouteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Agregar Nueva Ruta</h3>
                <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">OSRM + Street Routing - República Mexicana</p>
              </div>
              <button
                onClick={() => {
                  setShowRouteModal(false);
                  setSelectedDestinations([]);
                  setSelectedCity('');
                  setSelectedState('');
                  setSelectedOriginCity('');
                  setSelectedOriginState('');
                }}
                className="p-2 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Origen */}
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-green-700" />
                <label className="text-[10px] font-bold uppercase text-green-700">📍 Origen</label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div>
                  <select
                    value={selectedOriginState}
                    onChange={(e) => {
                      setSelectedOriginState(e.target.value);
                      setSelectedOriginCity('');
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-green-200 text-sm bg-white focus:outline-none focus:border-green-500"
                  >
                    <option value="">Selecciona Estado</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={selectedOriginCity}
                    onChange={(e) => setSelectedOriginCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-green-200 text-sm bg-white focus:outline-none focus:border-green-500"
                    disabled={!selectedOriginState}
                  >
                    <option value="">Selecciona Ciudad</option>
                    {selectedOriginState && statesData[selectedOriginState as keyof typeof statesData]?.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              {selectedOriginCity && selectedOriginState && (
                <p className="text-xs text-green-700 font-semibold mt-2">
                  Origen: {selectedOriginCity}, {selectedOriginState}
                </p>
              )}
            </div>

            {/* Selector de Destinos */}
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500">📦 Destinos de Entrega</label>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Selecciona los destinos para el envío de canastas</p>
              </div>

              {/* Lista de destinos seleccionados */}
              {selectedDestinations.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  {selectedDestinations.map((dest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold"
                    >
                      {dest}
                      <button
                        onClick={() => handleRemoveDestination(dest)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Selector de estado y ciudad para destinos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCity('');
                    }}
                    className="w-full px-3 py-2 rounded-2xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Selecciona Estado</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:border-blue-500"
                    disabled={!selectedState}
                  >
                    <option value="">Selecciona Ciudad</option>
                    {selectedState && statesData[selectedState as keyof typeof statesData]?.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleAddDestination}
                disabled={!selectedCity || !selectedState}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-black uppercase transition-all"
              >
                Agregar Destino
              </button>

              {/* Pueblos Mágicos del estado seleccionado */}
              {selectedState && getMagicalTownsByState(selectedState).length > 0 && (
                <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
                    <p className="text-[10px] font-bold uppercase text-amber-700">
                      ✨ Pueblos Mágicos en {selectedState}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getMagicalTownsByState(selectedState).map(town => (
                      <button
                        key={town}
                        onClick={() => handleAddMagicalTown(town)}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Star className="w-3 h-3 fill-white" />
                        {town}
                      </button>
                    ))}
                  </div>
                  <p className="text-[8px] text-amber-600 font-semibold mt-2">
                    💡 Haz clic en un Pueblo Mágico para agregarlo como destino de entrega
                  </p>
                </div>
              )}

              {/* Lista rápida de ciudades populares */}
              <div className="mt-4">
                <p className="text-[9px] font-bold uppercase text-slate-400 mb-2">📍 Ciudades Populares</p>
                <div className="flex flex-wrap gap-2">
                  {['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Cancún', 'Mérida', 'Veracruz', 'Acapulco', 'Tijuana', 'León'].map(city => {
                    const state = Object.keys(statesData).find(s => statesData[s as keyof typeof statesData]?.includes(city));
                    const fullDest = `${city}, ${state}`;
                    return (
                      <button
                        key={city}
                        onClick={() => {
                          if (state && !selectedDestinations.includes(fullDest)) {
                            setSelectedDestinations([...selectedDestinations, fullDest]);
                          }
                        }}
                        disabled={selectedDestinations.includes(fullDest)}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl text-[10px] font-semibold text-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {city}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={handleSaveRoute}
                className="flex-1 px-6 py-3 bg-[#78281F] hover:bg-[#5E1F18] text-white rounded-2xl text-xs font-black uppercase transition-all"
              >
                Guardar Ruta
              </button>
              <button
                onClick={() => {
                  setShowRouteModal(false);
                  setSelectedDestinations([]);
                  setSelectedCity('');
                  setSelectedState('');
                  setSelectedOriginCity('');
                  setSelectedOriginState('');
                }}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-xs font-bold uppercase transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}