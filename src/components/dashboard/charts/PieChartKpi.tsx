import { NormalizedKpiData } from '@/lib/api';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface PieChartKpiProps {
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

export function PieChartKpi({ kpi }: PieChartKpiProps) {
  if (!kpi.data?.length) {
    return (
      <div className="flex h-44 items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  // Transform raw data to chart format
  // Format: [{ "gender": "Male", "count": 22334 }, ...]
  const chartData = kpi.data.map(item => {
    let name = '';
    let value = 0;
    
    for (const [key, val] of Object.entries(item)) {
      if (typeof val === 'string' && !name) {
        name = val;
      } else if (typeof val === 'number' && key !== 'percentage') {
        value = val;
      }
    }
    
    return { name, value };
  });

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="hsl(var(--card))"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius)',
              fontSize: 12,
            }}
            formatter={(value: number) => [
              `${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`,
              'Count',
            ]}
          />
          <Legend
            verticalAlign="middle"
            align="right"
            layout="vertical"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11 }}
            formatter={(value) => {
              const item = chartData.find((d) => d.name === value);
              const percentage = item ? ((item.value / total) * 100).toFixed(1) : 0;
              return (
                <span style={{ color: 'hsl(var(--foreground))' }}>
                  {value} ({percentage}%)
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
