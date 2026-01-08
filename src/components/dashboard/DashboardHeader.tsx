import { RefreshCw } from 'lucide-react';
import { HealthResponse } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface DashboardHeaderProps {
  health: HealthResponse | null;
  timestamp: string | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({ health, timestamp, isLoading, onRefresh }: DashboardHeaderProps) {
  const getLastUpdated = () => {
    if (!timestamp) return 'Never';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              U
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Uniform Demand Forecast
              </h1>
              <p className="text-sm text-muted-foreground">
                Master Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {health && (
              <div className="flex items-center gap-2 text-sm">
                <span className={`h-2 w-2 rounded-full ${health.status === 'healthy' ? 'bg-success' : 'bg-warning'}`} />
                <span className="text-muted-foreground">
                  {health.status === 'healthy' ? 'Connected' : 'Checking...'}
                </span>
              </div>
            )}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
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
