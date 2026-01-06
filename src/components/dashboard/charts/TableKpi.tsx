import { NormalizedKpiData } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TableKpiProps {
  kpi: NormalizedKpiData;
}

export function TableKpi({ kpi }: TableKpiProps) {
  const data = kpi.data || [];

  if (!data.length) {
    return (
      <div className="flex h-44 items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  const displayColumns = Object.keys(data[0] || {});

  const formatColumnName = (col: string) => {
    return col
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatValue = (value: unknown, column: string) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') {
      if (column.includes('consumption') || column.includes('count')) {
        return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
      }
      return value.toLocaleString();
    }
    return String(value);
  };

  return (
    <ScrollArea className="h-56">
      <Table>
        <TableHeader>
          <TableRow>
            {displayColumns.slice(0, 4).map((col) => (
              <TableHead key={col} className="text-xs font-medium">
                {formatColumnName(col)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(0, 10).map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {displayColumns.slice(0, 4).map((col) => (
                <TableCell key={col} className="py-2 text-sm">
                  {formatValue(row[col], col)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {data.length > 10 && (
        <div className="py-2 text-center text-xs text-muted-foreground">
          Showing 10 of {data.length} items
        </div>
      )}
    </ScrollArea>
  );
}
