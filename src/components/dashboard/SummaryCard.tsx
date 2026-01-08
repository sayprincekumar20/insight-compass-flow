import { TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: number;
  trend?: number;
  trendLabel?: string;
}

export function SummaryCard({ title, value, trend, trendLabel }: SummaryCardProps) {
  const isPositive = trend && trend > 0;
  
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <p className="text-sm font-medium text-primary">{title}</p>
      <div className="mt-2 flex items-end justify-between">
        <span className="text-3xl font-bold text-foreground tabular-nums">
          {value.toLocaleString()}
        </span>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${
            isPositive ? 'text-success' : 'text-destructive'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="font-medium">
              {isPositive ? '+' : ''}{trend.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
