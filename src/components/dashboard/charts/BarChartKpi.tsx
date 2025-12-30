import { KpiDataResponse } from '@/lib/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface BarChartKpiProps {
  kpi: KpiDataResponse;
}

const COLORS = [
  'hsl(222, 47%, 35%)',
  'hsl(187, 71%, 42%)',
  'hsl(152, 69%, 40%)',
  'hsl(38, 92%, 50%)',
  'hsl(340, 75%, 55%)',
  'hsl(262, 52%, 47%)',
];

export function BarChartKpi({ kpi }: BarChartKpiProps) {
  const vizData = kpi.visualization?.data;

  if (!vizData?.labels || !vizData?.datasets?.[0]?.data) {
    return (
      <div className="flex h-44 items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  const chartData = vizData.labels.map((label, index) => ({
    name: label.length > 20 ? `${label.slice(0, 18)}...` : label,
    fullName: label,
    value: vizData.datasets[0].data[index],
  }));

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            width={100}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius)',
              fontSize: 12,
            }}
            formatter={(value: number) => [value.toLocaleString(), 'Count']}
            labelFormatter={(label) => chartData.find((d) => d.name === label)?.fullName || label}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
