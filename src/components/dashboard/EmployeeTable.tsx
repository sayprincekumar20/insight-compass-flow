import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface EmployeeTableProps {
  title: string;
  data: Record<string, unknown>[];
}

export function EmployeeTable({ title, data }: EmployeeTableProps) {
  // Transform data for table display
  const tableData = data.map((item) => ({
    department: item.department as string || 'Unknown',
    totalEmployees: Number(item.total_employees || item.employee_count || 0),
    activeEmployees: Number(item.active_employees || item.employee_count || 0),
    inactiveEmployees: Number(item.inactive_employees || 0),
    activePercentage: Number(item.active_percentage || 100),
    locationsCount: Number(item.locations_count || item.location_count || 1),
  }));

  const handleExport = () => {
    const csv = [
      ['Department', 'Total Employees', 'Active Employees', 'Inactive Employees', '% of Active Employees', 'Number of Locations Present'],
      ...tableData.map(row => [
        row.department,
        row.totalEmployees,
        row.activeEmployees,
        row.inactiveEmployees,
        `${row.activePercentage.toFixed(1)}%`,
        row.locationsCount
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'active_employees.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Department ↕</TableHead>
              <TableHead className="whitespace-nowrap text-right">Total Employees ↕</TableHead>
              <TableHead className="whitespace-nowrap text-right">Active Employees ↕</TableHead>
              <TableHead className="whitespace-nowrap text-right">Inactive Employees ↕</TableHead>
              <TableHead className="whitespace-nowrap text-right">% of Active Employees ↕</TableHead>
              <TableHead className="whitespace-nowrap text-right">Number of Locations Present ↕</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.length > 0 ? (
              tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-primary">
                    {row.department}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-primary">
                    {row.totalEmployees.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.activeEmployees.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-warning">
                    {row.inactiveEmployees.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-success">
                    {row.activePercentage.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-primary">
                    {row.locationsCount}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
