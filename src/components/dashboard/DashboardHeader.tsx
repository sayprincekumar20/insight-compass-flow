import { Users, Building2, MapPin, RefreshCw } from 'lucide-react';
import { DashboardSummary } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface DashboardHeaderProps {
  summary: DashboardSummary | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({ summary, isLoading, onRefresh }: DashboardHeaderProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getLastUpdated = () => {
    if (!summary?.last_updated) return 'Never';
    try {
      return formatDistanceToNow(new Date(summary.last_updated), { addSuffix: true });
    } catch {
      return 'Recently';
    }
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
              Employee Analytics & Workforce Insights
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
                  {isLoading ? '...' : formatNumber(summary?.total_active_employees || 0)}
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
                  {isLoading ? '...' : summary?.total_departments || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                <MapPin className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-primary-foreground/60">
                  Locations
                </p>
                <p className="text-xl font-bold tabular-nums">
                  {isLoading ? '...' : summary?.total_locations || 0}
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
