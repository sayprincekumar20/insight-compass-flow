import { NormalizedKpiData } from '@/lib/api';
import { useEffect, useState } from 'react';

interface NumberKpiProps {
  kpi: NormalizedKpiData;
}

export function NumberKpi({ kpi }: NumberKpiProps) {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Extract the value from data array
  // Format: [{ "total_active_employees": 41597 }]
  const getValue = (): number => {
    if (!kpi.data?.length) return 0;
    const firstItem = kpi.data[0];
    // Find the first numeric value in the object
    for (const key of Object.keys(firstItem)) {
      const val = firstItem[key];
      if (typeof val === 'number') return val;
    }
    return 0;
  };

  const targetValue = getValue();

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
          {displayValue.toLocaleString()}
        </span>
        <span className="ml-2 text-lg text-muted-foreground">employees</span>
      </div>
    </div>
  );
}
