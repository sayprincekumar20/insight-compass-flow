import { NormalizedKpiData } from '@/lib/api';
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
  kpi: NormalizedKpiData;
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
  if (!kpi.data?.length) {
    return (
      <div className="flex h-44 items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  // Transform raw data to chart format
  // Format: [{ "department": "X", "employee_count": 123 }, ...]
  const chartData = kpi.data.map(item => {
    // Find label key (first string value)
    let name = '';
    let value = 0;
    
    for (const [key, val] of Object.entries(item)) {
      if (typeof val === 'string' && !name) {
        name = val;
      } else if (typeof val === 'number' && key !== 'percentage') {
        value = val;
      }
    }
    
    return {
      name: name.length > 25 ? `${name.slice(0, 23)}...` : name,
      fullName: name,
      value,
    };
  });

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
            width={110}
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
