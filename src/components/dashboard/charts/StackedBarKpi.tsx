import { KpiDataResponse } from '@/lib/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface StackedBarKpiProps {
  kpi: KpiDataResponse;
}

const COLORS = [
  'hsl(222, 47%, 35%)',
  'hsl(340, 75%, 55%)',
  'hsl(152, 69%, 40%)',
  'hsl(38, 92%, 50%)',
];

export function StackedBarKpi({ kpi }: StackedBarKpiProps) {
  // Transform raw data for stacked bar
  const rawData = kpi.data || [];

  if (!rawData.length) {
    return (
      <div className="flex h-44 items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  // Group by department, count by gender
  const grouped: Record<string, Record<string, number>> = {};
  const genders = new Set<string>();

  rawData.forEach((item: any) => {
    const dept = item.department || item.function || 'Unknown';
    const gender = item.gender || 'Unknown';
    const count = item.count || item.employee_count || 1;

    if (!grouped[dept]) grouped[dept] = {};
    grouped[dept][gender] = (grouped[dept][gender] || 0) + count;
    genders.add(gender);
  });

  const chartData = Object.entries(grouped).map(([dept, counts]) => ({
    name: dept.length > 15 ? `${dept.slice(0, 13)}...` : dept,
    fullName: dept,
    ...counts,
  }));

  const genderArray = Array.from(genders);

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData.slice(0, 7)}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
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
            formatter={(value: number) => value.toLocaleString()}
            labelFormatter={(label) => chartData.find((d) => d.name === label)?.fullName || label}
          />
          <Legend
            verticalAlign="top"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11 }}
          />
          {genderArray.map((gender, index) => (
            <Bar
              key={gender}
              dataKey={gender}
              stackId="a"
              fill={COLORS[index % COLORS.length]}
              radius={index === genderArray.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
