import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  type: 'pie' | 'bar';
  data: Record<string, unknown>[];
  nameKey?: string;
  valueKey?: string;
  barColor?: string;
  showLegendBelow?: boolean;
}

const COLORS = [
  'hsl(222, 47%, 35%)',   // Primary blue
  'hsl(152, 69%, 40%)',   // Green
  'hsl(38, 92%, 50%)',    // Orange
  'hsl(340, 75%, 55%)',   // Pink
  'hsl(262, 52%, 47%)',   // Purple
  'hsl(187, 71%, 42%)',   // Teal
];

export function ChartCard({ 
  title, 
  subtitle,
  type, 
  data, 
  nameKey = 'name', 
  valueKey = 'value',
  barColor,
  showLegendBelow = false,
}: ChartCardProps) {
  // Transform data for charts
  const chartData = data.map((item, index) => ({
    name: String(item[nameKey] || item.employee_status || item.gender || item.department || `Item ${index + 1}`),
    value: Number(item[valueKey] || item.count || item.employee_count || 0),
    color: item.color as string || COLORS[index % COLORS.length],
  }));

  // Calculate total for percentages
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const renderPieChart = () => (
    <div className="flex h-full items-center">
      <ResponsiveContainer width="60%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={showLegendBelow ? 60 : 0}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={showLegendBelow ? ({ name, percent }) => 
              `${name}: ${(percent * 100).toFixed(1)}%` : undefined
            }
            labelLine={showLegendBelow}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [value.toLocaleString(), 'Count']}
          />
        </PieChart>
      </ResponsiveContainer>
      {!showLegendBelow && (
        <div className="flex-1 space-y-2 pl-4">
          {chartData.slice(0, 6).map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="h-3 w-3 rounded-sm" 
                style={{ backgroundColor: item.color }}
              />
              <span className="flex-1 truncate text-muted-foreground">
                {item.name}: {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 10 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip 
          formatter={(value: number) => [value.toLocaleString(), 'Count']}
        />
        <Bar 
          dataKey="value" 
          fill={barColor || 'hsl(222, 47%, 35%)'} 
          radius={[4, 4, 0, 0]}
        />
        <Legend 
          wrapperStyle={{ fontSize: 10, paddingTop: 10 }}
          payload={[{ value: type === 'bar' && title.includes('Gender') ? 'Active Employees' : 'Eligible Employees', type: 'rect', color: barColor || 'hsl(222, 47%, 35%)' }]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  if (!chartData.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
        <div className="mt-4 flex h-48 items-center justify-center text-sm text-muted-foreground">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {type === 'pie' ? renderPieChart() : renderBarChart()}
      {showLegendBelow && (
        <div className="mt-4 flex items-center justify-center gap-6 text-xs">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div 
                className="h-2.5 w-2.5 rounded-sm" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.name}</span>
              <span className="font-medium text-foreground">{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
