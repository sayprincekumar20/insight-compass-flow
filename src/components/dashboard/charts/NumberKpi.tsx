import { KpiDataResponse } from '@/lib/api';
import { useEffect, useState } from 'react';

interface NumberKpiProps {
  kpi: KpiDataResponse;
}

export function NumberKpi({ kpi }: NumberKpiProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const targetValue = kpi.visualization?.value || 0;
  const suffix = kpi.visualization?.suffix || '';
  const prefix = kpi.visualization?.prefix || '';

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = targetValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(targetValue, Math.round(increment * step));
      setDisplayValue(current);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(targetValue);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetValue]);

  return (
    <div className="flex h-full flex-col items-center justify-center py-6">
      <div className="text-center">
        <span className="text-5xl font-bold tabular-nums text-primary animate-count-up">
          {prefix}
          {displayValue.toLocaleString()}
        </span>
        {suffix && (
          <span className="ml-2 text-lg text-muted-foreground">{suffix}</span>
        )}
      </div>
    </div>
  );
}
