import { create } from 'zustand';
import * as api from '../services/api';
import type { DonanteAPI, UserAPI } from '../services/api';

// ──────────────────────────────────────────────────────────────────────────────
// Interfaces (preservadas — solo se agrega apiId)
// ──────────────────────────────────────────────────────────────────────────────

export interface Donation {
  id: string;
  apiId?: number;
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
  apiId?: number;
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
  apiId?: number;
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
  apiId?: number;
  title: string;
  unit: string;
  status: 'active' | 'reviewed';
}

export interface HistoricalRoute {
  id: string;
  apiId?: number;
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
  apiId?: number;
  type: 'caducidad' | 'incidencia';
  title: string;
  level: 'URGENTE' | 'RETRASO';
  desc: string;
  details: string;
  resolved: boolean;
  contactName?: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// State interface
// ──────────────────────────────────────────────────────────────────────────────

interface AppState {
  // Auth
  isAuthenticated: boolean;
  currentUser: { name: string; office: string; avatar?: string; role?: string } | null;
  token: string | null;

  // UI
  activeTab: 'dashboard' | 'reception' | 'packaging' | 'logistics' | 'users';
  isLoading: boolean;
  error: string | null;

  // Data
  donations: Donation[];
  kanbanTasks: KanbanTask[];
  logisticsUnits: LogisticsUnit[];
  logisticsIncidences: LogisticsIncidence[];
  historicalRoutes: HistoricalRoute[];
  operationalAlerts: OperationalAlert[];
  consolidationDestination: string;
  consolidationBarcode: string;
  consolidatedItems: { id: string; category: string; weight: number }[];

  // Donantes
  donantes: DonanteAPI[];
  selectedDonor: DonanteAPI | null;

  // Usuarios
  usuarios: UserAPI[];
  usuariosPagination: { total: number; page: number; limit: number; pages: number } | null;

  // Auth actions
  initAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;

  // Navigation
  setTab: (tab: 'dashboard' | 'reception' | 'packaging' | 'logistics' | 'users') => void;

  // Fetch actions
  fetchAllData: () => Promise<void>;
  fetchDonaciones: () => Promise<void>;
  fetchDonantes: (search?: string) => Promise<void>;
  fetchLotes: () => Promise<void>;
  fetchUnidades: () => Promise<void>;
  fetchIncidencias: () => Promise<void>;
  fetchHistorialRutas: () => Promise<void>;
  fetchAlertas: () => Promise<void>;
  fetchConsolidacion: () => Promise<void>;

  // Mutation actions
  addDonation: (donation: Omit<Donation, 'id' | 'timestamp' | 'apiId'>) => Promise<void>;
  addDonante: (data: {
    nombre: string; empresa?: string; rfc?: string; telefono?: string;
    email?: string; direccion?: string; categoria?: string; tipo?: string; notas?: string;
  }) => Promise<DonanteAPI>;
  setSelectedDonor: (donor: DonanteAPI | null) => void;
  moveKanbanTask: (id: string, column: 'PENDIENTE' | 'EN_PROCESO' | 'CONTROL_CALIDAD') => Promise<void>;
  resolveOperationalAlert: (id: string, action: string) => Promise<void>;
  resolveLogisticsIncidence: (id: string) => Promise<void>;
  addConsolidationItem: (item: { id: string; category: string; weight: number }) => Promise<void>;
  clearConsolidation: () => Promise<void>;

  // Usuario actions
  fetchUsuarios: (params?: { page?: number; limit?: number; search?: string; role?: string }) => Promise<void>;
  createUsuario: (data: Record<string, unknown>) => Promise<void>;
  deleteUsuario: (id: number) => Promise<void>;

  // Sync actions

  setConsolidationDestination: (dest: string) => void;
  setConsolidationBarcode: (barcode: string) => void;
}

// ──────────────────────────────────────────────────────────────────────────────
// Store
// ──────────────────────────────────────────────────────────────────────────────

export const useStore = create<AppState>((set, get) => ({
  // ── Initial state ──
  isAuthenticated: false,
  currentUser: null,
  token: null,
  activeTab: 'dashboard',
  isLoading: false,
  error: null,

  donations: [],
  kanbanTasks: [],
  logisticsUnits: [],
  logisticsIncidences: [],
  historicalRoutes: [],
  operationalAlerts: [],
  consolidationDestination: 'Despensa Centro',
  consolidationBarcode: '',
  consolidatedItems: [],

  donantes: [],
  selectedDonor: null,

  usuarios: [],
  usuariosPagination: null,

  // ── Auth ──────────────────────────────────────────────────────────────────

  initAuth: () => {
    const token = localStorage.getItem('seda_token');
    const userStr = localStorage.getItem('seda_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ isAuthenticated: true, token, currentUser: user });
        get().fetchAllData();
      } catch {
        localStorage.removeItem('seda_token');
        localStorage.removeItem('seda_user');
      }
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.login(email, password);
      const user = {
        name: res.usuario.nombre,
        office: res.usuario.office,
        role: res.usuario.role,
      };
      localStorage.setItem('seda_token', res.token);
      localStorage.setItem('seda_user', JSON.stringify(user));
      set({
        isAuthenticated: true,
        token: res.token,
        currentUser: user,
        isLoading: false,
        error: null,
      });
      await get().fetchAllData();
    } catch (err) {
      set({
        isLoading: false,
        error: (err as Error).message || 'Error al iniciar sesión',
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('seda_token');
    localStorage.removeItem('seda_user');
    set({
      isAuthenticated: false,
      currentUser: null,
      token: null,
      activeTab: 'dashboard',
      donations: [],
      kanbanTasks: [],
      logisticsUnits: [],
      logisticsIncidences: [],
      historicalRoutes: [],
      operationalAlerts: [],
      consolidatedItems: [],
      donantes: [],
      selectedDonor: null,
      usuarios: [],
      usuariosPagination: null,
    });
  },

  clearError: () => set({ error: null }),

  // ── Navigation ──

  setTab: (tab) => set({ activeTab: tab }),

  // ── Fetch actions ────────────────────────────────────────────────────────

  fetchAllData: async () => {
    set({ isLoading: true });
    try {
      const [
        donations,
        kanbanTasks,
        logisticsUnits,
        logisticsIncidences,
        historicalRoutes,
        operationalAlerts,
        consolidacion,
      ] = await Promise.all([
        api.getDonaciones(),
        api.getLotes(),
        api.getUnidades(),
        api.getIncidencias(),
        api.getHistorialRutas(),
        api.getAlertas(),
        api.getConsolidacion(),
      ]);
      set({
        donations,
        kanbanTasks,
        logisticsUnits,
        logisticsIncidences,
        historicalRoutes,
        operationalAlerts,
        consolidatedItems: consolidacion.items,
        consolidationDestination: consolidacion.destination,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message });
    }
  },

  fetchDonaciones: async () => {
    try {
      const donations = await api.getDonaciones();
      set({ donations });
    } catch (err) {
      console.error('Error fetching donaciones:', err);
    }
  },

  fetchDonantes: async (search?: string) => {
    try {
      const donantes = await api.getDonantes(search);
      set({ donantes });
    } catch (err) {
      console.error('Error fetching donantes:', err);
    }
  },

  fetchLotes: async () => {
    try {
      const kanbanTasks = await api.getLotes();
      set({ kanbanTasks });
    } catch (err) {
      console.error('Error fetching lotes:', err);
    }
  },

  fetchUnidades: async () => {
    try {
      const logisticsUnits = await api.getUnidades();
      set({ logisticsUnits });
    } catch (err) {
      console.error('Error fetching unidades:', err);
    }
  },

  fetchIncidencias: async () => {
    try {
      const logisticsIncidences = await api.getIncidencias();
      set({ logisticsIncidences });
    } catch (err) {
      console.error('Error fetching incidencias:', err);
    }
  },

  fetchHistorialRutas: async () => {
    try {
      const historicalRoutes = await api.getHistorialRutas();
      set({ historicalRoutes });
    } catch (err) {
      console.error('Error fetching historial:', err);
    }
  },

  fetchAlertas: async () => {
    try {
      const operationalAlerts = await api.getAlertas();
      set({ operationalAlerts });
    } catch (err) {
      console.error('Error fetching alertas:', err);
    }
  },

  fetchConsolidacion: async () => {
    try {
      const consolidacion = await api.getConsolidacion();
      set({
        consolidatedItems: consolidacion.items,
        consolidationDestination: consolidacion.destination,
      });
    } catch (err) {
      console.error('Error fetching consolidacion:', err);
    }
  },

  // ── Mutation actions ─────────────────────────────────────────────────────

  addDonation: async (donation) => {
    try {
      await api.createDonacion({
        donor_name: donation.donorName,
        category: donation.category,
        weight: donation.weight,
        batch_number: donation.batchNumber || undefined,
        expiration_date: donation.expirationDate || undefined,
        temperature: donation.temperature,
        vehicle_status: donation.vehicleStatus,
        notes: donation.notes || undefined,
        evidence_name: donation.evidenceName,
        status: donation.status,
        issue_details: donation.issueDetails,
      });
      // Refetch donations + lotes (API auto-creates a lote on donation creation)
      await Promise.all([get().fetchDonaciones(), get().fetchLotes()]);
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  addDonante: async (data) => {
    try {
      const newDonante = await api.createDonante(data);
      // Auto-select the newly created donor and refresh list
      set({ selectedDonor: newDonante });
      await get().fetchDonantes();
      return newDonante;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  setSelectedDonor: (donor) => set({ selectedDonor: donor }),

  moveKanbanTask: async (id, column) => {
    const task = get().kanbanTasks.find(t => t.id === id);
    if (!task?.apiId) return;
    try {
      await api.moverLote(task.apiId, column);
      await get().fetchLotes();
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  resolveOperationalAlert: async (id, action) => {
    const alert = get().operationalAlerts.find(a => a.id === id);
    if (!alert?.apiId) return;
    try {
      await api.resolverAlerta(alert.apiId, action);
      await Promise.all([get().fetchAlertas(), get().fetchHistorialRutas()]);
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  resolveLogisticsIncidence: async (id) => {
    const inc = get().logisticsIncidences.find(i => i.id === id);
    if (!inc?.apiId) return;
    try {
      await api.resolverIncidencia(inc.apiId);
      await get().fetchIncidencias();
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  addConsolidationItem: async (item) => {
    try {
      await api.addConsolidacionItem({
        codigo: item.id,
        category: item.category,
        weight: item.weight,
        destination: get().consolidationDestination,
      });
      await get().fetchConsolidacion();
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  clearConsolidation: async () => {
    try {
      await api.clearConsolidacion();
      set({ consolidatedItems: [] });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  // ── Sync actions ──

  setConsolidationDestination: (dest) => set({ consolidationDestination: dest }),
  setConsolidationBarcode: (barcode) => set({ consolidationBarcode: barcode }),

  fetchUsuarios: async (params = {}) => {
    try {
      const res = await api.getUsuarios({ page: 1, limit: 10, ...params });
      set({ usuarios: res.data, usuariosPagination: res.pagination });
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },

  createUsuario: async (data) => {
    try {
      await api.createUsuario(data);
      await get().fetchUsuarios();
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  deleteUsuario: async (id) => {
    try {
      await api.deleteUsuario(id);
      await get().fetchUsuarios();
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },
}));
