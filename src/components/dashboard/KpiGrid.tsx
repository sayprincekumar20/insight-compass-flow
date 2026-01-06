import { NormalizedKpiData } from '@/lib/api';
import { KpiCard } from './KpiCard';
import { Skeleton } from '@/components/ui/skeleton';

interface KpiGridProps {
  kpis: NormalizedKpiData[];
  isLoading: boolean;
}

export function KpiGrid({ kpis, isLoading }: KpiGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <Skeleton className="mb-4 h-6 w-3/4" />
            <Skeleton className="mb-2 h-4 w-1/2" />
            <Skeleton className="h-44 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!kpis.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-card">
        <p className="text-muted-foreground">No KPI data available</p>
      </div>
    );
  }

  // Sort KPIs by chart type for better visual layout
  const sortedKpis = [...kpis].sort((a, b) => {
    const order = ['number', 'bar', 'pie', 'line', 'stacked_bar', 'table'];
    const aIndex = order.indexOf(a.chart_type || 'bar');
    const bIndex = order.indexOf(b.chart_type || 'bar');
    return aIndex - bIndex;
  });

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {sortedKpis.map((kpi, index) => (
        <KpiCard key={kpi.kpi_id} kpi={kpi} index={index} />
      ))}
    </div>
  );
}
