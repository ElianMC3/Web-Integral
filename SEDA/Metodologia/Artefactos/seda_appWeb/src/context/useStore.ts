import { create } from 'zustand';

const API_BASE_URL = 'http://localhost:3001/api';

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('seda_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (response.status === 401) {
    localStorage.removeItem('seda_token');
    localStorage.removeItem('seda_user');
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }
  return response.json();
};

export interface Donation {
  id: string;
  dbId?: number;
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
  dbId?: number;
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
  dbId?: number;
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
  dbId?: number;
  title: string;
  unit: string;
  status: 'active' | 'reviewed';
}

export interface HistoricalRoute {
  id: string;
  dbId?: number;
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
  dbId?: number;
  type: 'caducidad' | 'incidencia';
  title: string;
  level: 'URGENTE' | 'RETRASO';
  desc: string;
  details: string;
  resolved: boolean;
  contactName?: string;
}

export interface ConsolidatedItem {
  id: string;
  category: string;
  weight: number;
}

// Mappers...
const mapDonationFromApi = (apiDonation: any): Donation => ({
  id: apiDonation.codigo,
  dbId: apiDonation.id,
  donorName: apiDonation.donor_name,
  donorId: apiDonation.donante_id?.toString() || apiDonation.codigo,
  category: apiDonation.category,
  weight: apiDonation.weight,
  batchNumber: apiDonation.batch_number || '',
  expirationDate: apiDonation.expiration_date || '',
  temperature: apiDonation.temperature || 0,
  vehicleStatus: apiDonation.vehicle_status || 'Óptimo',
  notes: apiDonation.notes || '',
  evidenceName: apiDonation.evidence_name || undefined,
  signatureData: apiDonation.signature_data || undefined,
  timestamp: apiDonation.timestamp || '',
  status: apiDonation.status || 'Pendiente Clasificación',
  issueDetails: apiDonation.issue_details || undefined,
});

const mapKanbanTaskFromApi = (apiLote: any): KanbanTask => ({
  id: apiLote.codigo,
  dbId: apiLote.id,
  title: apiLote.title,
  donor: apiLote.donor || '',
  weight: apiLote.weight || '',
  dueDate: apiLote.due_date || 'Sin fecha',
  status: apiLote.status,
  column: apiLote.columna,
  progress: apiLote.progress ?? undefined,
  location: apiLote.location ?? undefined,
  assignedTo: apiLote.assigned_to ?? undefined,
});

const mapLogisticsUnitFromApi = (apiUnidad: any): LogisticsUnit => ({
  id: apiUnidad.codigo,
  dbId: apiUnidad.id,
  driver: apiUnidad.driver,
  type: apiUnidad.type,
  capacity: apiUnidad.capacity,
  loadPercentage: apiUnidad.load_percentage || 0,
  temp: apiUnidad.temp ?? undefined,
  eta: apiUnidad.eta ?? undefined,
  statusBadge: apiUnidad.status_badge ?? undefined,
  location: apiUnidad.location ?? undefined,
});

const mapLogisticsIncidenceFromApi = (apiIncidencia: any): LogisticsIncidence => ({
  id: apiIncidencia.codigo,
  dbId: apiIncidencia.id,
  title: apiIncidencia.title,
  unit: apiIncidencia.unit,
  status: apiIncidencia.status,
});

const mapHistoricalRouteFromApi = (apiHistorial: any): HistoricalRoute => ({
  id: apiHistorial.codigo,
  dbId: apiHistorial.id,
  driver: apiHistorial.driver,
  unit: apiHistorial.unit,
  actionText: apiHistorial.action_text,
  lote: apiHistorial.lote || '',
  details: apiHistorial.details || '',
  time: apiHistorial.time || '',
  date: apiHistorial.date || '',
  statusBadge: apiHistorial.status_badge || '',
  statusColor: apiHistorial.status_color || '',
  extraBadge: apiHistorial.extra_badge || undefined,
});

const mapOperationalAlertFromApi = (apiAlerta: any): OperationalAlert => ({
  id: apiAlerta.codigo,
  dbId: apiAlerta.id,
  type: apiAlerta.type,
  title: apiAlerta.title,
  level: apiAlerta.level,
  desc: apiAlerta.description || '',
  details: apiAlerta.details || '',
  resolved: !!apiAlerta.resolved,
  contactName: apiAlerta.contact_name ?? undefined,
});

const mapConsolidatedItemFromApi = (apiConsolidado: any): ConsolidatedItem => ({
  id: apiConsolidado.codigo,
  category: apiConsolidado.category,
  weight: apiConsolidado.weight,
});

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
  consolidatedItems: ConsolidatedItem[];
  
  // Actions
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  fetchInitialData: () => Promise<void>;
  setTab: (tab: 'dashboard' | 'reception' | 'packaging' | 'logistics') => void;
  setConsolidationDestination: (dest: string) => void;
  setConsolidationBarcode: (barcode: string) => void;
  addDonation: (donation: Omit<Donation, 'id' | 'timestamp'>) => Promise<void>;
  moveKanbanTask: (id: string, column: 'PENDIENTE' | 'EN_PROCESO' | 'CONTROL_CALIDAD') => Promise<void>;
  resolveOperationalAlert: (id: string, action: string) => Promise<void>;
  resolveLogisticsIncidence: (id: string) => Promise<void>;
  calculateRoute: (origin: string, destination: string) => Promise<{ success: boolean; message?: string; data?: any }>;
  addConsolidationItem: (item: ConsolidatedItem) => Promise<void>;
  clearConsolidation: () => Promise<void>;
}

// Inicialización segura con localStorage
const initialToken = typeof window !== 'undefined' ? localStorage.getItem('seda_token') : null;
const initialUser = typeof window !== 'undefined' ? (() => {
  try {
    const userStr = localStorage.getItem('seda_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
})() : null;

export const useStore = create<AppState>((set, get) => {
  const fetchInitialData = async () => {
    try {
      const [donationsRes, kanbanRes, unitsRes, incidencesRes, routesRes, alertsRes, consolidationRes] = await Promise.all([
        apiFetch('/donaciones'),
        apiFetch('/lotes'),
        apiFetch('/unidades'),
        apiFetch('/incidencias'),
        apiFetch('/historial-rutas'),
        apiFetch('/alertas'),
        apiFetch('/consolidacion'),
      ]);

      set({
        donations: donationsRes.success ? donationsRes.data.map(mapDonationFromApi) : [],
        kanbanTasks: kanbanRes.success ? kanbanRes.data.map(mapKanbanTaskFromApi) : [],
        logisticsUnits: unitsRes.success ? unitsRes.data.map(mapLogisticsUnitFromApi) : [],
        logisticsIncidences: incidencesRes.success ? incidencesRes.data.map(mapLogisticsIncidenceFromApi) : [],
        historicalRoutes: routesRes.success ? routesRes.data.map(mapHistoricalRouteFromApi) : [],
        operationalAlerts: alertsRes.success ? alertsRes.data.map(mapOperationalAlertFromApi) : [],
        consolidatedItems: consolidationRes.success ? consolidationRes.data.map(mapConsolidatedItemFromApi) : [],
        consolidationDestination: (consolidationRes.success && consolidationRes.destination) ? consolidationRes.destination : get().consolidationDestination,
      });
    } catch (error) {
      console.error('Error loading SEDA database data:', error);
    }
  };

  return {
    isAuthenticated: !!initialToken,
    currentUser: initialUser,
    activeTab: 'dashboard',

    donations: [],
    kanbanTasks: [],
    logisticsUnits: [],
    logisticsIncidences: [],
    historicalRoutes: [],
    operationalAlerts: [],
    consolidationDestination: 'Despensa Centro',
    consolidationBarcode: '',
    consolidatedItems: [],

    login: async (email, password) => {
      try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.success) {
          localStorage.setItem('seda_token', data.token);
          localStorage.setItem('seda_user', JSON.stringify(data.usuario));
          set({
            isAuthenticated: true,
            currentUser: data.usuario,
          });
          await fetchInitialData();
          return { success: true };
        } else {
          return { success: false, message: data.message || 'Credenciales incorrectas' };
        }
      } catch (err: any) {
        console.error(err);
        return { success: false, message: 'Error de conexión con el servidor de la API.' };
      }
    },

    logout: () => {
      localStorage.removeItem('seda_token');
      localStorage.removeItem('seda_user');
      set({
        isAuthenticated: false,
        currentUser: null,
        activeTab: 'dashboard',
        donations: [],
        kanbanTasks: [],
        logisticsUnits: [],
        logisticsIncidences: [],
        historicalRoutes: [],
        operationalAlerts: [],
        consolidatedItems: [],
      });
    },

    fetchInitialData,

    setTab: (tab) => set({ activeTab: tab }),

    // ✅ AGREGADAS ESTAS DOS FUNCIONES
    setConsolidationDestination: (dest) => set({ consolidationDestination: dest }),
    setConsolidationBarcode: (barcode) => set({ consolidationBarcode: barcode }),

    addDonation: async (donation) => {
      try {
        const apiBody = {
          donor_name: donation.donorName,
          donante_id: donation.donorId ? parseInt(donation.donorId) : null,
          category: donation.category,
          weight: donation.weight,
          batch_number: donation.batchNumber,
          expiration_date: donation.expirationDate,
          temperature: donation.temperature,
          vehicle_status: donation.vehicleStatus,
          notes: donation.notes,
          evidence_name: donation.evidenceName,
          status: donation.status,
          issue_details: donation.issueDetails,
        };

        const res = await apiFetch('/donaciones', {
          method: 'POST',
          body: JSON.stringify(apiBody),
        });

        if (res.success) {
          await fetchInitialData();
        }
      } catch (error) {
        console.error('Error adding donation:', error);
      }
    },

    moveKanbanTask: async (id, column) => {
      try {
        const task = get().kanbanTasks.find((t) => t.id === id);
        if (!task || !task.dbId) return;

        const res = await apiFetch(`/lotes/${task.dbId}/mover`, {
          method: 'PATCH',
          body: JSON.stringify({ columna: column }),
        });

        if (res.success) {
          await fetchInitialData();
        }
      } catch (error) {
        console.error('Error moving Kanban task:', error);
      }
    },

    resolveOperationalAlert: async (id, action) => {
      try {
        const alertItem = get().operationalAlerts.find((a) => a.id === id);
        if (!alertItem || !alertItem.dbId) return;

        const res = await apiFetch(`/alertas/${alertItem.dbId}/resolver`, {
          method: 'PATCH',
          body: JSON.stringify({ action }),
        });

        if (res.success) {
          await fetchInitialData();
        }
      } catch (error) {
        console.error('Error resolving operational alert:', error);
      }
    },

    resolveLogisticsIncidence: async (id) => {
      try {
        const incidence = get().logisticsIncidences.find((inc) => inc.id === id);
        if (!incidence || !incidence.dbId) return;

        const res = await apiFetch(`/incidencias/${incidence.dbId}/resolver`, {
          method: 'PATCH',
        });

        if (res.success) {
          await fetchInitialData();
        }
      } catch (error) {
        console.error('Error resolving logistics incidence:', error);
      }
    },

    calculateRoute: async (origin, destination) => {
      try {
        const coords = `${origin};${destination}`;
        const res = await apiFetch(`/routing?coords=${encodeURIComponent(coords)}`);
        return res;
      } catch (error: any) {
        console.error('Error calculating route:', error);
        return { success: false, message: 'Error al calcular la ruta.' };
      }
    },

    addConsolidationItem: async (item) => {
      try {
        const res = await apiFetch('/consolidacion', {
          method: 'POST',
          body: JSON.stringify(item),
        });

        if (res.success) {
          await fetchInitialData();
        }
      } catch (error) {
        console.error('Error adding consolidation item:', error);
      }
    },

    clearConsolidation: async () => {
      try {
        const res = await apiFetch('/consolidacion', {
          method: 'DELETE',
        });

        if (res.success) {
          await fetchInitialData();
        }
      } catch (error) {
        console.error('Error clearing consolidation:', error);
      }
    },
  };
});