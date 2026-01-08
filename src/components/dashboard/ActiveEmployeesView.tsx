import { NormalizedKpiData } from '@/lib/api';
import { SummaryCard } from './SummaryCard';
import { ChartCard } from './ChartCard';
import { EmployeeTable } from './EmployeeTable';
import { Skeleton } from '@/components/ui/skeleton';

interface ActiveEmployeesViewProps {
  kpis: NormalizedKpiData[];
  isLoading: boolean;
}

export function ActiveEmployeesView({ kpis, isLoading }: ActiveEmployeesViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Summary Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
        {/* Charts Skeleton */}
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-72 rounded-lg" />
          <Skeleton className="h-72 rounded-lg" />
          <Skeleton className="h-72 rounded-lg" />
          <Skeleton className="h-72 rounded-lg" />
        </div>
        {/* Table Skeleton */}
        <Skeleton className="h-80 rounded-lg" />
      </div>
    );
  }

  // Extract KPIs by type
  const totalEmployees = kpis.find(k => 
    k.kpi_id === 'total_employee_count' || k.kpi_id === 'total_active_employees'
  );
  const statusDistribution = kpis.find(k => k.kpi_id === 'employee_status_distribution');
  const departmentData = kpis.find(k => 
    k.kpi_id === 'active_employees_by_department' || k.kpi_id === 'department_table'
  );
  const genderDistribution = kpis.find(k => k.kpi_id === 'gender_distribution');
  const issuanceMonthData = kpis.find(k => k.kpi_id === 'eligible_by_issuance_month');

  const totalValue = Number(totalEmployees?.data?.[0]?.total_employee_count || 
                     totalEmployees?.data?.[0]?.total_active_employees || 0);
  
  const statusData = statusDistribution?.data as Array<{ employee_status: string; count: number }> | undefined;
  const activeCount = statusData?.find(d => d.employee_status === 'Active')?.count || totalValue;
  const inactiveCount = statusData?.find(d => d.employee_status === 'Inactive')?.count || 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <SummaryCard
          title="Total Employees"
          value={totalValue}
          trend={3.2}
          trendLabel="vs last month"
        />
        <SummaryCard
          title="Active Employees"
          value={activeCount}
          trend={2.1}
          trendLabel="vs last month"
        />
      </div>

      {/* Charts Grid - 2x2 */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard
          title="Employee Status Distribution"
          type="pie"
          data={statusDistribution?.data || [
            { name: 'Active', value: activeCount, color: 'hsl(187, 71%, 42%)' },
            { name: 'Inactive', value: inactiveCount, color: 'hsl(220, 15%, 70%)' }
          ]}
          showLegendBelow
        />
        <ChartCard
          title="Active Employees by Department"
          type="pie"
          data={departmentData?.data || []}
          nameKey="department"
          valueKey="employee_count"
        />
        <ChartCard
          title="Eligible Employee Count by Issuance Month"
          subtitle={issuanceMonthData ? "Showing data from Jan 2024 to Dec 2024" : undefined}
          type="bar"
          data={issuanceMonthData?.data || []}
          nameKey="month"
          valueKey="count"
          barColor="hsl(152, 69%, 40%)"
        />
        <ChartCard
          title="Active Employees by Gender"
          type="bar"
          data={genderDistribution?.data || []}
          nameKey="gender"
          valueKey="count"
          barColor="hsl(222, 47%, 35%)"
        />
      </div>

      {/* Data Table */}
      <EmployeeTable
        title="Active Employees"
        data={departmentData?.data || []}
      />
    </div>
  );
}
