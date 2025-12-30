const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface KpiDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  chart_type: string;
  supports_filters: boolean;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FiltersResponse {
  departments: FilterOption[];
  locations: FilterOption[];
  designations: FilterOption[];
  genders: FilterOption[];
  date_range: {
    min_date: string;
    max_date: string;
  };
  last_updated: string;
}

export interface KpiFilters {
  departments?: string[];
  locations?: string[];
  designations?: string[];
  gender?: string;
  start_date?: string;
  end_date?: string;
}

export interface VisualizationData {
  type: string;
  value?: number;
  format?: string;
  prefix?: string;
  suffix?: string;
  color?: string;
  message?: string;
  data?: {
    labels: string[];
    datasets: Array<{
      label?: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
      borderWidth?: number;
      fill?: boolean;
      tension?: number;
    }>;
  };
  columns?: string[];
  options?: Record<string, unknown>;
}

export interface KpiDataResponse {
  kpi_id: string;
  kpi_name: string;
  description: string;
  category: string;
  data: Record<string, unknown>[];
  visualization: VisualizationData;
  summary: Record<string, number>;
  filters_applied: Record<string, unknown>;
  query_metadata: {
    row_count: number;
    execution_time: string;
  };
}

export interface DashboardSummary {
  total_active_employees: number;
  total_departments: number;
  total_locations: number;
  last_updated: string;
}

export interface DashboardResponse {
  dashboard_data: KpiDataResponse[];
  filters_applied: Record<string, unknown>;
  generated_at: string;
  total_kpis: number;
  successful_kpis: number;
}

// Fetch all available KPIs
export async function fetchKpis(): Promise<KpiDefinition[]> {
  const response = await fetch(`${API_BASE_URL}/kpi/`);
  if (!response.ok) throw new Error('Failed to fetch KPIs');
  return response.json();
}

// Fetch all filters
export async function fetchFilters(): Promise<FiltersResponse> {
  const response = await fetch(`${API_BASE_URL}/filters/`);
  if (!response.ok) throw new Error('Failed to fetch filters');
  return response.json();
}

// Fetch dashboard summary
export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const response = await fetch(`${API_BASE_URL}/kpi/dashboard/summary`);
  if (!response.ok) throw new Error('Failed to fetch dashboard summary');
  return response.json();
}

// Fetch dashboard with all KPIs
export async function fetchDashboard(filters?: KpiFilters): Promise<DashboardResponse> {
  const response = await fetch(`${API_BASE_URL}/kpi/dashboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filters || {}),
  });
  if (!response.ok) throw new Error('Failed to fetch dashboard');
  return response.json();
}

// Fetch specific KPI data
export async function fetchKpiData(kpiId: string, filters?: KpiFilters): Promise<KpiDataResponse> {
  const response = await fetch(`${API_BASE_URL}/kpi/data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      kpi_id: kpiId,
      filters: filters || {},
    }),
  });
  if (!response.ok) throw new Error('Failed to fetch KPI data');
  return response.json();
}
