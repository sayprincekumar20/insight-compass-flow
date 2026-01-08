const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Filter types
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
  gender?: string[];
  start_date?: string;
  end_date?: string;
}

// KPI Definition from /api/dashboard/kpis
export interface KpiDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  chart_type: 'number' | 'bar' | 'pie' | 'line' | 'table' | 'stacked_bar';
  tool_name: string;
  tool_parameter: string;
}

// Dashboard data item structure
export interface DashboardDataItem {
  tool: string;
  parameters: {
    kpi_type: string;
    filters?: Record<string, unknown>;
  };
  data: {
    kpi_id: string;
    kpi_name: string;
    data: Record<string, unknown>[];
    filters_applied: Record<string, unknown>;
  };
}

// Main dashboard response
export interface DashboardResponse {
  success: boolean;
  filters_applied: Record<string, unknown>;
  tools_called: Array<{ tool: string; parameters: Record<string, unknown> }>;
  successful_tools: string[];
  failed_tools: string[];
  dashboard_data: DashboardDataItem[];
  ai_decision: boolean;
  timestamp: string;
}

// Initial dashboard response
export interface InitialDashboardResponse {
  success: boolean;
  dashboard_data: Array<{
    kpi_id: string;
    kpi_name: string;
    data: Record<string, unknown>[];
    filters_applied: Record<string, unknown>;
  }>;
  initial_load: boolean;
  filters_applied: Record<string, unknown>;
  tools_used: string[];
  ai_decision: boolean;
  timestamp: string;
}

// KPIs list response
export interface KpisListResponse {
  success: boolean;
  kpis: KpiDefinition[];
  count: number;
}

// Health check response
export interface HealthResponse {
  status: string;
  mcp_connection: string;
  ai_connection: string;
  available_tools: number;
  available_kpis: number;
}

// Normalized KPI data for components
export interface NormalizedKpiData {
  kpi_id: string;
  kpi_name: string;
  category: string;
  chart_type: string;
  data: Record<string, unknown>[];
  filters_applied: Record<string, unknown>;
}

// Fetch all filters
export async function fetchFilters(): Promise<FiltersResponse> {
  const response = await fetch(`${API_BASE_URL}/filters/`);
  if (!response.ok) throw new Error('Failed to fetch filters');
  return response.json();
}

// Fetch initial dashboard (no filters)
export async function fetchInitialDashboard(): Promise<InitialDashboardResponse> {
  const response = await fetch(`${API_BASE_URL}/dashboard/initial`);
  if (!response.ok) throw new Error('Failed to fetch initial dashboard');
  return response.json();
}

// Fetch dashboard with filters (POST - AI decides)
export async function fetchDashboard(filters?: KpiFilters): Promise<DashboardResponse> {
  const hasFilters = filters && Object.keys(filters).some(key => {
    const value = filters[key as keyof KpiFilters];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== '';
  });

  // If no filters, use initial endpoint
  if (!hasFilters) {
    const initialResponse = await fetchInitialDashboard();
    // Transform to DashboardResponse format
    return {
      success: initialResponse.success,
      filters_applied: initialResponse.filters_applied,
      tools_called: [],
      successful_tools: initialResponse.tools_used,
      failed_tools: [],
      dashboard_data: initialResponse.dashboard_data.map(item => ({
        tool: 'get_dashboard_overview',
        parameters: { kpi_type: 'overview', filters: {} },
        data: item,
      })),
      ai_decision: initialResponse.ai_decision,
      timestamp: initialResponse.timestamp,
    };
  }

  // Clean up filters - remove empty arrays
  const cleanFilters: Record<string, unknown> = {};
  if (filters.departments?.length) cleanFilters.departments = filters.departments;
  if (filters.locations?.length) cleanFilters.locations = filters.locations;
  if (filters.designations?.length) cleanFilters.designations = filters.designations;
  if (filters.gender?.length) cleanFilters.gender = filters.gender;
  if (filters.start_date) cleanFilters.start_date = filters.start_date;
  if (filters.end_date) cleanFilters.end_date = filters.end_date;

  const response = await fetch(`${API_BASE_URL}/dashboard/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filters: cleanFilters }),
  });
  if (!response.ok) throw new Error('Failed to fetch dashboard');
  return response.json();
}

// Fetch available KPIs
export async function fetchKpis(): Promise<KpisListResponse> {
  const response = await fetch(`${API_BASE_URL}/dashboard/kpis`);
  if (!response.ok) throw new Error('Failed to fetch KPIs');
  return response.json();
}

// Fetch health status
export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/dashboard/health`);
  if (!response.ok) throw new Error('Failed to fetch health status');
  return response.json();
}

// Helper to get KPI chart type from kpi_id
export function getChartType(kpiId: string): string {
  const chartTypes: Record<string, string> = {
    total_active_employees: 'number',
    active_employees_by_department: 'bar',
    gender_distribution: 'pie',
    active_employees_by_location: 'bar',
    active_employees_by_designation: 'bar',
    hiring_trend_by_joining_date: 'line',
    employee_tenure_analysis: 'pie',
    gender_split_by_department: 'stacked_bar',
    avg_monthly_consumption_per_item: 'table',
    inventory_stock_levels: 'bar',
    projected_headcount: 'table',
  };
  return chartTypes[kpiId] || 'bar';
}

// Helper to get KPI category from kpi_id
export function getCategory(kpiId: string): string {
  const categories: Record<string, string> = {
    total_active_employees: 'workforce',
    active_employees_by_department: 'workforce',
    gender_distribution: 'diversity',
    active_employees_by_location: 'geographic',
    active_employees_by_designation: 'hierarchy',
    hiring_trend_by_joining_date: 'trend',
    employee_tenure_analysis: 'workforce',
    gender_split_by_department: 'diversity',
    avg_monthly_consumption_per_item: 'inventory',
    inventory_stock_levels: 'inventory',
    projected_headcount: 'forecast',
  };
  return categories[kpiId] || 'workforce';
}

// Normalize dashboard data for components
export function normalizeDashboardData(response: DashboardResponse): NormalizedKpiData[] {
  return response.dashboard_data.map(item => ({
    kpi_id: item.data.kpi_id,
    kpi_name: item.data.kpi_name,
    category: getCategory(item.data.kpi_id),
    chart_type: getChartType(item.data.kpi_id),
    data: item.data.data,
    filters_applied: item.data.filters_applied,
  }));
}
