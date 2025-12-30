import { KpiDataResponse } from '@/lib/api';
import { NumberKpi } from './charts/NumberKpi';
import { BarChartKpi } from './charts/BarChartKpi';
import { PieChartKpi } from './charts/PieChartKpi';
import { LineChartKpi } from './charts/LineChartKpi';
import { TableKpi } from './charts/TableKpi';
import { StackedBarKpi } from './charts/StackedBarKpi';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  kpi: KpiDataResponse;
  index: number;
}

const categoryIcons: Record<string, string> = {
  workforce: '👥',
  diversity: '🌈',
  geographic: '📍',
  hierarchy: '🏢',
  inventory: '📦',
  forecast: '🔮',
  trend: '📈',
};

export function KpiCard({ kpi, index }: KpiCardProps) {
  const renderChart = () => {
    const chartType = kpi.visualization?.type;

    switch (chartType) {
      case 'number':
        return <NumberKpi kpi={kpi} />;
      case 'bar':
        return <BarChartKpi kpi={kpi} />;
      case 'pie':
        return <PieChartKpi kpi={kpi} />;
      case 'line':
        return <LineChartKpi kpi={kpi} />;
      case 'table':
        return <TableKpi kpi={kpi} />;
      case 'stacked_bar':
        return <StackedBarKpi kpi={kpi} />;
      default:
        return (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            <p>Chart type "{chartType}" not supported</p>
          </div>
        );
    }
  };

  const getTrendIndicator = () => {
    const summary = kpi.summary;
    if (!summary || summary.total === undefined) return null;

    // This is placeholder logic - would need actual trend data
    return null;
  };

  return (
    <div
      className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:shadow-card-hover animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg" role="img" aria-label={kpi.category}>
              {categoryIcons[kpi.category] || '📊'}
            </span>
            <h3 className="font-semibold text-card-foreground">
              {kpi.kpi_name}
            </h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
            {kpi.description}
          </p>
        </div>
        {getTrendIndicator()}
      </div>

      <div className="min-h-[180px]">{renderChart()}</div>

      {kpi.summary && Object.keys(kpi.summary).length > 0 && kpi.visualization?.type !== 'number' && (
        <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4">
          {kpi.summary.total !== undefined && (
            <div className="text-sm">
              <span className="text-muted-foreground">Total: </span>
              <span className="font-medium tabular-nums">
                {kpi.summary.total.toLocaleString()}
              </span>
            </div>
          )}
          {kpi.summary.average !== undefined && (
            <div className="text-sm">
              <span className="text-muted-foreground">Avg: </span>
              <span className="font-medium tabular-nums">
                {kpi.summary.average.toLocaleString(undefined, { maximumFractionDigits: 1 })}
              </span>
            </div>
          )}
          {kpi.summary.count !== undefined && (
            <div className="text-sm">
              <span className="text-muted-foreground">Count: </span>
              <span className="font-medium tabular-nums">
                {kpi.summary.count}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
