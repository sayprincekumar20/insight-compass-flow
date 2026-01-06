import { NormalizedKpiData } from '@/lib/api';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface LineChartKpiProps {
  kpi: NormalizedKpiData;
}

export function LineChartKpi({ kpi }: LineChartKpiProps) {
  if (!kpi.data?.length) {
    return (
      <div className="flex h-44 items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  // Transform raw data to chart format
  const chartData = kpi.data.map(item => {
    let label = '';
    let value = 0;
    
    for (const [key, val] of Object.entries(item)) {
      if (typeof val === 'string' && !label) {
        label = val;
      } else if (typeof val === 'number') {
        value = val;
      }
    }
    
    return { name: label, value };
  });

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(187, 71%, 42%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(187, 71%, 42%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => {
              if (value.match(/^\d{4}-\d{2}$/)) {
                const [year, month] = value.split('-');
                const date = new Date(parseInt(year), parseInt(month) - 1);
                return date.toLocaleDateString('en', { month: 'short', year: '2-digit' });
              }
              return value;
            }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius)',
              fontSize: 12,
            }}
            formatter={(value: number) => [value.toLocaleString(), 'Count']}
            labelFormatter={(label) => {
              if (label.match(/^\d{4}-\d{2}$/)) {
                const [year, month] = label.split('-');
                const date = new Date(parseInt(year), parseInt(month) - 1);
                return date.toLocaleDateString('en', { month: 'long', year: 'numeric' });
              }
              return label;
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(187, 71%, 42%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
