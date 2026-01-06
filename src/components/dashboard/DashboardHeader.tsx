import { Users, Building2, MapPin, RefreshCw, Activity } from 'lucide-react';
import { NormalizedKpiData, HealthResponse } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface DashboardHeaderProps {
  kpis: NormalizedKpiData[];
  health: HealthResponse | null;
  timestamp: string | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({ kpis, health, timestamp, isLoading, onRefresh }: DashboardHeaderProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getLastUpdated = () => {
    if (!timestamp) return 'Never';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  // Extract total employees from KPIs
  const getTotalEmployees = (): number => {
    const totalKpi = kpis.find(k => k.kpi_id === 'total_active_employees');
    if (!totalKpi?.data?.[0]) return 0;
    const firstItem = totalKpi.data[0];
    for (const val of Object.values(firstItem)) {
      if (typeof val === 'number') return val;
    }
    return 0;
  };

  // Extract department count from KPIs
  const getDepartmentCount = (): number => {
    const deptKpi = kpis.find(k => k.kpi_id === 'active_employees_by_department');
    return deptKpi?.data?.length || 0;
  };

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
              KPI Dashboard
            </h1>
            <p className="mt-1 text-primary-foreground/80">
              AI-Powered Employee Analytics
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-primary-foreground/60">
                  Active Employees
                </p>
                <p className="text-xl font-bold tabular-nums">
                  {isLoading ? '...' : formatNumber(getTotalEmployees())}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                <Building2 className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-primary-foreground/60">
                  Departments
                </p>
                <p className="text-xl font-bold tabular-nums">
                  {isLoading ? '...' : getDepartmentCount()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                <Activity className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-primary-foreground/60">
                  AI Status
                </p>
                <p className="text-sm font-medium">
                  {health?.status === 'healthy' ? (
                    <span className="text-green-300">● Connected</span>
                  ) : (
                    <span className="text-yellow-300">● Checking...</span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-secondary/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/30 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                Updated {getLastUpdated()}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
