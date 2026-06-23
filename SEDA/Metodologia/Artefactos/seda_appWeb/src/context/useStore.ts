import { create } from 'zustand';

export interface Donation {
  id: string;
  donorName: string;
  donorId: string;
  category: string;
  weight: number;
  batchNumber: string;
  expirationDate: string;
  temperature: number;
  vehicleStatus: string;
  notes: string;
  evidenceName?: string;
  signatureData?: string;
  timestamp: string;
  status: 'Aprobado' | 'Retenido' | 'Pendiente Clasificación';
  issueDetails?: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  donor: string;
  weight: string;
  dueDate: string;
  status: 'Frío' | 'Asignado' | 'Sin asignar' | 'Esperando Inspector';
  column: 'PENDIENTE' | 'EN_PROCESO' | 'CONTROL_CALIDAD';
  progress?: number;
  location?: string;
  assignedTo?: string;
}

export interface LogisticsUnit {
  id: string;
  driver: string;
  type: 'Refrigerado' | 'Seco';
  capacity: string;
  loadPercentage: number;
  temp?: string;
  eta?: string;
  statusBadge?: string;
  location?: string;
}

export interface LogisticsIncidence {
  id: string;
  title: string;
  unit: string;
  status: 'active' | 'reviewed';
}

export interface HistoricalRoute {
  id: string;
  driver: string;
  unit: string;
  actionText: string;
  lote: string;
  details: string;
  time: string;
  date: string;
  statusBadge: string;
  statusColor: string;
  extraBadge?: string;
}

export interface OperationalAlert {
  id: string;
  type: 'caducidad' | 'incidencia';
  title: string;
  level: 'URGENTE' | 'RETRASO';
  desc: string;
  details: string;
  resolved: boolean;
  contactName?: string;
}

interface AppState {
  isAuthenticated: boolean;
  currentUser: { name: string; office: string; avatar?: string } | null;
  activeTab: 'dashboard' | 'reception' | 'packaging' | 'logistics';
  donations: Donation[];
  kanbanTasks: KanbanTask[];
  logisticsUnits: LogisticsUnit[];
  logisticsIncidences: LogisticsIncidence[];
  historicalRoutes: HistoricalRoute[];
  operationalAlerts: OperationalAlert[];
  consolidationDestination: string;
  consolidationBarcode: string;
  consolidatedItems: { id: string; category: string; weight: number }[];
  
  // Actions
  login: (email: string) => void;
  logout: () => void;
  setTab: (tab: 'dashboard' | 'reception' | 'packaging' | 'logistics') => void;
  addDonation: (donation: Omit<Donation, 'id' | 'timestamp'>) => void;
  moveKanbanTask: (id: string, column: 'PENDIENTE' | 'EN_PROCESO' | 'CONTROL_CALIDAD') => void;
  resolveOperationalAlert: (id: string, action: string) => void;
  resolveLogisticsIncidence: (id: string) => void;
  setConsolidationDestination: (dest: string) => void;
  setConsolidationBarcode: (barcode: string) => void;
  addConsolidationItem: (item: { id: string; category: string; weight: number }) => void;
  clearConsolidation: () => void;
}

export const useStore = create<AppState>((set) => ({
  isAuthenticated: false,
  currentUser: null,
  activeTab: 'dashboard',

  donations: [
    {
      id: 'DON-8492',
      donorName: 'Supermercados La Granja',
      donorId: 'DON-8492',
      category: 'Abarrotes',
      weight: 250,
      batchNumber: 'L-48290',
      expirationDate: '2026-08-20',
      temperature: 20,
      vehicleStatus: 'Óptimo',
      notes: 'Llegada a tiempo. Cajas en perfecto estado.',
      status: 'Aprobado',
      timestamp: '10:45 AM'
    },
    {
      id: 'DON-8493',
      donorName: 'Productora Agrícola Sur',
      donorId: 'DON-8493',
      category: 'Perecederos',
      weight: 120,
      batchNumber: 'L-48291',
      expirationDate: '2026-06-25',
      temperature: 8,
      vehicleStatus: 'Óptimo',
      notes: 'Temperatura de llegada al límite de control.',
      status: 'Retenido',
      issueDetails: 'Temperatura de llegada límite (8°C). Requiere inspección de calidad.',
      timestamp: '11:15 AM'
    },
    {
      id: 'DON-8494',
      donorName: 'Donante Particular',
      donorId: 'DON-8494',
      category: 'Mixto',
      weight: 45,
      batchNumber: 'L-48292',
      expirationDate: '2026-07-10',
      temperature: 18,
      vehicleStatus: 'Regular',
      notes: 'Donación mixta menor de alimentos secos y algunas frutas.',
      status: 'Pendiente Clasificación',
      timestamp: '11:50 AM'
    }
  ],

  kanbanTasks: [
    {
      id: 'LOTE-9921',
      title: 'Lácteos Mixtos',
      donor: 'Supermercado A',
      weight: '150kg',
      dueDate: 'Hoy 14:00',
      status: 'Frío',
      column: 'PENDIENTE'
    },
    {
      id: 'LOTE-9922',
      title: 'Abarrotes Generales',
      donor: 'Mayorista Sur',
      weight: '500kg',
      dueDate: 'Mañana',
      status: 'Sin asignar',
      column: 'PENDIENTE'
    },
    {
      id: 'LOTE-9915',
      title: 'Verduras Mixtas',
      donor: 'Productor Local',
      weight: '300kg',
      dueDate: 'Hoy 18:00',
      status: 'Asignado',
      column: 'EN_PROCESO',
      progress: 60,
      location: 'Mesa 4',
      assignedTo: 'Carlos D.'
    },
    {
      id: 'LOTE-9908',
      title: 'Cajas Despensa Familiar',
      donor: 'Despensa Sur',
      weight: '50 Cajas',
      dueDate: 'Esperando Inspector',
      status: 'Esperando Inspector',
      column: 'CONTROL_CALIDAD'
    }
  ],

  logisticsUnits: [
    {
      id: 'TR-01',
      driver: 'Miguel Ángel',
      type: 'Refrigerado',
      capacity: '12T',
      loadPercentage: 85,
      temp: '-18°C',
      eta: '14:30'
    },
    {
      id: 'CV-04',
      driver: 'Roberto P.',
      type: 'Seco',
      capacity: '8T',
      loadPercentage: 40,
      statusBadge: 'CARGA EN PROCESO',
      location: 'Andén 2'
    }
  ],

  logisticsIncidences: [
    { id: 'INC-01', title: 'Desvío de Ruta (TR-02)', unit: 'TR-02', status: 'active' },
    { id: 'INC-02', title: 'Retraso Tráfico (CV-01)', unit: 'CV-01', status: 'active' }
  ],

  historicalRoutes: [
    {
      id: 'HIST-01',
      driver: 'Miguel Ángel (TR-01)',
      unit: 'TR-01',
      actionText: 'completó la entrega del',
      lote: 'LOTE-9918',
      details: 'Destino: Zona Sur (Despensas comunitarias, Sector 2) • Tipo: Perecederos',
      time: '14:30 PM',
      date: '11/05/2026',
      statusBadge: 'Entrega Exitosa',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      extraBadge: 'Temp Final: -17.8°C'
    },
    {
      id: 'HIST-02',
      driver: 'Sistema',
      unit: 'SYSTEM',
      actionText: 'reasignó la ruta para',
      lote: 'LOTE-9919',
      details: 'Motivo: Retraso por tráfico reportado en Ruta Principal Norte.',
      time: '10:15 AM',
      date: '11/05/2026',
      statusBadge: 'Desvío Autorizado',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      id: 'HIST-03',
      driver: 'Roberto P. (CV-04)',
      unit: 'CV-04',
      actionText: 'completó la entrega del',
      lote: 'LOTE-9915',
      details: 'Destino: Comedor Comunitario Esperanza • Tipo: Secos',
      time: '16:45 PM',
      date: '10/05/2026',
      statusBadge: 'Entrega Exitosa',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
  ],

  operationalAlerts: [
    {
      id: 'ALERT-01',
      type: 'caducidad',
      title: 'Caducidad Próxima (Lácteos)',
      level: 'URGENTE',
      desc: 'DON L-4592 (150kg) caduca en 48h.',
      details: 'Ubicación: Cámara Frío 2, Pasillo B.',
      resolved: false
    },
    {
      id: 'ALERT-02',
      type: 'incidencia',
      title: 'Incidencia en Ruta Norte-04',
      level: 'RETRASO',
      desc: 'Tráfico pesado reportado. Retraso estimado de 45 min en recolección de Donante D-12.',
      details: 'Acción sugerida: Re-rutar vehículo.',
      resolved: false,
      contactName: 'Roberto P. (CV-04)'
    }
  ],

  consolidationDestination: 'Despensa Centro',
  consolidationBarcode: '',
  consolidatedItems: [
    { id: 'LOTE-9901', category: 'No Perecederos', weight: 50 },
    { id: 'LOTE-9905', category: 'Perecederos', weight: 50 }
  ],

  // Action implementations
  login: (email: string) => set({
    isAuthenticated: true,
    currentUser: {
      name: email && email.includes('@') ? email.split('@')[0] : 'Carlos Dispatcher',
      office: 'Despensa Norte',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
    }
  }),

  logout: () => set({ isAuthenticated: false, currentUser: null, activeTab: 'dashboard' }),

  setTab: (tab) => set({ activeTab: tab }),

  addDonation: (donation) => set((state) => {
    const newId = `DON-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonationItem: Donation = {
      ...donation,
      id: newId,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };

    // Add corresponding task to Kanban
    const newKanbanTask: KanbanTask = {
      id: `LOTE-${Math.floor(9000 + Math.random() * 1000)}`,
      title: `${donation.category} Recibidos`,
      donor: donation.donorName,
      weight: `${donation.weight}kg`,
      dueDate: donation.expirationDate ? `Vence: ${donation.expirationDate}` : 'Sin fecha',
      status: donation.category.toLowerCase().includes('perecedero') || donation.category.toLowerCase().includes('lácteo') ? 'Frío' : 'Sin asignar',
      column: 'PENDIENTE'
    };

    // Update operational dashboard metrics as well
    return {
      donations: [newDonationItem, ...state.donations],
      kanbanTasks: [newKanbanTask, ...state.kanbanTasks]
    };
  }),

  moveKanbanTask: (id, column) => set((state) => ({
    kanbanTasks: state.kanbanTasks.map((task) => {
      if (task.id === id) {
        let update: Partial<KanbanTask> = { column };
        if (column === 'EN_PROCESO') {
          update.progress = 10;
          update.location = 'Mesa ' + Math.floor(1 + Math.random() * 5);
          update.assignedTo = 'Carlos D.';
        } else if (column === 'CONTROL_CALIDAD') {
          update.status = 'Esperando Inspector';
        }
        return { ...task, ...update };
      }
      return task;
    })
  })),

  resolveOperationalAlert: (id, action) => set((state) => {
    const updatedAlerts = state.operationalAlerts.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    );
    
    // Add to history
    const matchedAlert = state.operationalAlerts.find(a => a.id === id);
    let newHistory: HistoricalRoute | null = null;
    
    if (matchedAlert) {
      newHistory = {
        id: `HIST-${Math.floor(10000 + Math.random() * 90000)}`,
        driver: 'Sistema / Carlos D.',
        unit: 'ALERT_RESOLUTION',
        actionText: 'resolvió alerta de',
        lote: matchedAlert.title,
        details: `Acción: ${action} • ${matchedAlert.desc}`,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        date: '11/05/2026',
        statusBadge: 'Acción Ejecutada',
        statusColor: 'bg-blue-100 text-blue-800 border-blue-200'
      };
    }

    return {
      operationalAlerts: updatedAlerts,
      historicalRoutes: newHistory ? [newHistory, ...state.historicalRoutes] : state.historicalRoutes
    };
  }),

  resolveLogisticsIncidence: (id) => set((state) => ({
    logisticsIncidences: state.logisticsIncidences.map((inc) => 
      inc.id === id ? { ...inc, status: 'reviewed' } : inc
    )
  })),

  setConsolidationDestination: (dest) => set({ consolidationDestination: dest }),
  
  setConsolidationBarcode: (barcode) => set({ consolidationBarcode: barcode }),

  addConsolidationItem: (item) => set((state) => ({
    consolidatedItems: [...state.consolidatedItems, item]
  })),

  clearConsolidation: () => set({ consolidatedItems: [] })
}));
