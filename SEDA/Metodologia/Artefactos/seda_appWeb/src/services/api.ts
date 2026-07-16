/**
 * SEDA API Service — Cliente HTTP centralizado
 * 
 * Todas las llamadas al backend pasan por aquí.
 * JWT se inyecta automáticamente desde localStorage.
 */

import type {
  Donation,
  KanbanTask,
  LogisticsUnit,
  LogisticsIncidence,
  HistoricalRoute,
  OperationalAlert,
} from '../context/useStore';

const API_URL = import.meta.env.VITE_API_URL || '';

// ──────────────────────────────────────────────────────────────────────────────
// HTTP Client base
// ──────────────────────────────────────────────────────────────────────────────

async function request<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('seda_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  // Si el token expiró o es inválido, limpiar sesión
  if (res.status === 401) {
    localStorage.removeItem('seda_token');
    localStorage.removeItem('seda_user');
    window.location.reload();
    throw new Error('Sesión expirada. Inicie sesión nuevamente.');
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || `Error ${res.status}`);
  }

  return data as T;
}

// ──────────────────────────────────────────────────────────────────────────────
// Data mappers:  API snake_case → Frontend camelCase
// ──────────────────────────────────────────────────────────────────────────────

export function mapDonacion(d: Record<string, unknown>): Donation {
  return {
    id: (d.codigo as string) || String(d.id),
    apiId: d.id as number,
    donorName: (d.donor_name as string) || '',
    donorId: (d.codigo as string) || String(d.id),
    category: (d.category as string) || '',
    weight: (d.weight as number) || 0,
    batchNumber: (d.batch_number as string) || '',
    expirationDate: (d.expiration_date as string) || '',
    temperature: (d.temperature as number) || 0,
    vehicleStatus: (d.vehicle_status as string) || 'Óptimo',
    notes: (d.notes as string) || '',
    evidenceName: d.evidence_name as string | undefined,
    signatureData: d.signature_data as string | undefined,
    timestamp: (d.timestamp as string) || '',
    status: (d.status as Donation['status']) || 'Pendiente Clasificación',
    issueDetails: d.issue_details as string | undefined,
  };
}

export function mapLote(l: Record<string, unknown>): KanbanTask {
  const column = (l.columna as KanbanTask['column']) || 'PENDIENTE';
  let progress = l.progress as number | undefined;

  // El progreso depende estrictamente de la columna
  if (column === 'PENDIENTE') progress = 0;
  else if (column === 'EN_PROCESO') progress = 50;
  else if (column === 'CONTROL_CALIDAD') progress = 100;

  return {
    id: (l.codigo as string) || String(l.id),
    apiId: l.id as number,
    title: (l.title as string) || '',
    donor: (l.donor as string) || '',
    weight: (l.weight as string) || '',
    dueDate: (l.due_date as string) || '',
    status: (l.status as KanbanTask['status']) || 'Sin asignar',
    column,
    progress,
    location: l.location as string | undefined,
    assignedTo: l.assigned_to as string | undefined,
  };
}

export function mapUnidad(u: Record<string, unknown>): LogisticsUnit {
  return {
    id: (u.codigo as string) || String(u.id),
    apiId: u.id as number,
    driver: (u.driver as string) || '',
    type: (u.type as LogisticsUnit['type']) || 'Seco',
    capacity: (u.capacity as string) || '',
    loadPercentage: (u.load_percentage as number) || 0,
    temp: u.temp as string | undefined,
    eta: u.eta as string | undefined,
    statusBadge: u.status_badge as string | undefined,
    location: u.location as string | undefined,
  };
}

export function mapIncidencia(i: Record<string, unknown>): LogisticsIncidence {
  return {
    id: (i.codigo as string) || String(i.id),
    apiId: i.id as number,
    title: (i.title as string) || '',
    unit: (i.unit as string) || '',
    status: (i.status as LogisticsIncidence['status']) || 'active',
  };
}

export function mapHistorialRuta(h: Record<string, unknown>): HistoricalRoute {
  return {
    id: (h.codigo as string) || String(h.id),
    apiId: h.id as number,
    driver: (h.driver as string) || '',
    unit: (h.unit as string) || '',
    actionText: (h.action_text as string) || '',
    lote: (h.lote as string) || '',
    details: (h.details as string) || '',
    time: (h.time as string) || '',
    date: (h.date as string) || '',
    statusBadge: (h.status_badge as string) || '',
    statusColor: (h.status_color as string) || '',
    extraBadge: h.extra_badge as string | undefined,
  };
}

export function mapAlerta(a: Record<string, unknown>): OperationalAlert {
  return {
    id: (a.codigo as string) || String(a.id),
    apiId: a.id as number,
    type: (a.type as OperationalAlert['type']) || 'incidencia',
    title: (a.title as string) || '',
    level: (a.level as OperationalAlert['level']) || 'RETRASO',
    desc: (a.description as string) || '',
    details: (a.details as string) || '',
    resolved: !!(a.resolved),
    contactName: a.contact_name as string | undefined,
  };
}

export function mapConsolidacionItem(c: Record<string, unknown>): { id: string; category: string; weight: number } {
  return {
    id: (c.codigo as string) || String(c.id),
    category: (c.category as string) || '',
    weight: (c.weight as number) || 0,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// API Functions
// ──────────────────────────────────────────────────────────────────────────────

// ── Auth ──

interface LoginResponse {
  success: boolean;
  token: string;
  usuario: { id: number; email: string; nombre: string; office: string; role: string };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// ── Donaciones ──

interface ListResponse<T> {
  success: boolean;
  data: T[];
  total: number;
}

export async function getDonaciones(): Promise<Donation[]> {
  const res = await request<ListResponse<Record<string, unknown>>>('/api/donaciones');
  return res.data.map(mapDonacion);
}

export async function createDonacion(data: {
  donor_name: string;
  category: string;
  weight: number;
  batch_number?: string;
  expiration_date?: string;
  temperature?: number;
  vehicle_status?: string;
  notes?: string;
  evidence_name?: string;
  status?: string;
  issue_details?: string;
}): Promise<void> {
  await request('/api/donaciones', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ── Donantes ──

export interface DonanteAPI {
  id: number;
  codigo?: string;
  nombre: string;
  empresa?: string;
  rfc?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  categoria?: string;
  tipo?: string;
  notas?: string;
}

export async function getDonantes(search?: string): Promise<DonanteAPI[]> {
  const qs = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await request<ListResponse<DonanteAPI>>(`/api/donantes${qs}`);
  return res.data;
}

export async function createDonante(data: {
  nombre: string;
  empresa?: string;
  rfc?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  categoria?: string;
  tipo?: string;
  notas?: string;
}): Promise<DonanteAPI> {
  const res = await request<{ success: boolean; data: DonanteAPI }>('/api/donantes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
}


// ── Lotes (Kanban) ──

export async function getLotes(): Promise<KanbanTask[]> {
  const res = await request<ListResponse<Record<string, unknown>>>('/api/lotes');
  return res.data.map(mapLote);
}

export async function moverLote(id: number, columna: string): Promise<void> {
  await request(`/api/lotes/${id}/mover`, {
    method: 'PATCH',
    body: JSON.stringify({ columna }),
  });
}

// ── Unidades ──

export async function getUnidades(): Promise<LogisticsUnit[]> {
  const res = await request<ListResponse<Record<string, unknown>>>('/api/unidades');
  return res.data.map(mapUnidad);
}

// ── Incidencias ──

export async function getIncidencias(): Promise<LogisticsIncidence[]> {
  const res = await request<ListResponse<Record<string, unknown>>>('/api/incidencias');
  return res.data.map(mapIncidencia);
}

export async function resolverIncidencia(id: number): Promise<void> {
  await request(`/api/incidencias/${id}/resolver`, { method: 'PATCH' });
}

// ── Historial de Rutas ──

export async function getHistorialRutas(): Promise<HistoricalRoute[]> {
  const res = await request<ListResponse<Record<string, unknown>>>('/api/historial-rutas');
  return res.data.map(mapHistorialRuta);
}

// ── Alertas ──

export async function getAlertas(): Promise<OperationalAlert[]> {
  const res = await request<ListResponse<Record<string, unknown>>>('/api/alertas');
  return res.data.map(mapAlerta);
}

export async function resolverAlerta(id: number, action: string): Promise<void> {
  await request(`/api/alertas/${id}/resolver`, {
    method: 'PATCH',
    body: JSON.stringify({ action }),
  });
}

// ── Consolidación ──

interface ConsolidacionResponse {
  success: boolean;
  data: Record<string, unknown>[];
  total: number;
  total_weight: number;
  destination: string;
}

export async function getConsolidacion(): Promise<{
  items: { id: string; category: string; weight: number }[];
  destination: string;
}> {
  const res = await request<ConsolidacionResponse>('/api/consolidacion');
  return {
    items: res.data.map(mapConsolidacionItem),
    destination: res.destination || 'Despensa Centro',
  };
}

export async function addConsolidacionItem(data: {
  codigo: string;
  category: string;
  weight: number;
  destination?: string;
}): Promise<void> {
  await request('/api/consolidacion/items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function clearConsolidacion(): Promise<void> {
  await request('/api/consolidacion', { method: 'DELETE' });
}

// ── Usuarios ──

export interface UserAPI {
  id: number;
  email: string;
  nombre: string;
  office: string;
  avatar?: string;
  role: string;
  created_at: string;
}

export interface UsersResponse {
  success: boolean;
  data: UserAPI[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export async function getUsuarios(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<UsersResponse> {
  const queryParts: string[] = [];
  if (params.page !== undefined) queryParts.push(`page=${params.page}`);
  if (params.limit !== undefined) queryParts.push(`limit=${params.limit}`);
  if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
  if (params.role) queryParts.push(`role=${encodeURIComponent(params.role)}`);
  
  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  return request<UsersResponse>(`/api/usuarios${queryString}`);
}

export async function createUsuario(data: Record<string, unknown>): Promise<{ success: boolean; data: UserAPI; message?: string }> {
  return request<{ success: boolean; data: UserAPI; message?: string }>('/api/usuarios', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteUsuario(id: number): Promise<void> {
  await request(`/api/usuarios/${id}`, {
    method: 'DELETE',
  });
}
