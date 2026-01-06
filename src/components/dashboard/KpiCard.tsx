import { NormalizedKpiData } from '@/lib/api';
import { NumberKpi } from './charts/NumberKpi';
import { BarChartKpi } from './charts/BarChartKpi';
import { PieChartKpi } from './charts/PieChartKpi';

interface KpiCardProps {
  kpi: NormalizedKpiData;
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
    switch (kpi.chart_type) {
      case 'number':
        return <NumberKpi kpi={kpi} />;
      case 'bar':
        return <BarChartKpi kpi={kpi} />;
      case 'pie':
        return <PieChartKpi kpi={kpi} />;
      default:
        return (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            <p>Chart type "{kpi.chart_type}" not supported yet</p>
          </div>
        );
    }
  };

  // Calculate summary from data
  const getSummary = () => {
    if (!kpi.data?.length) return null;
    
    // For number type, no summary needed
    if (kpi.chart_type === 'number') return null;

    // Get numeric values from data
    const values: number[] = [];
    kpi.data.forEach(item => {
      const numericKeys = ['employee_count', 'count', 'value', 'percentage'];
      for (const key of numericKeys) {
        if (typeof item[key] === 'number') {
          values.push(item[key] as number);
          break;
        }
      }
    });

    if (values.length === 0) return null;

    const total = values.reduce((sum, v) => sum + v, 0);
    const avg = total / values.length;
    
    return { total, average: avg, count: values.length };
  };

  const summary = getSummary();

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
        </div>
      </div>

      <div className="min-h-[180px]">{renderChart()}</div>

      {summary && kpi.chart_type !== 'number' && (
        <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Total: </span>
            <span className="font-medium tabular-nums">
              {summary.total.toLocaleString()}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Avg: </span>
            <span className="font-medium tabular-nums">
              {summary.average.toLocaleString(undefined, { maximumFractionDigits: 1 })}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Count: </span>
            <span className="font-medium tabular-nums">
              {summary.count}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
