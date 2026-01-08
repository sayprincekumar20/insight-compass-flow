import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardTabs, DashboardTab } from '@/components/dashboard/DashboardTabs';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { ActiveEmployeesView } from '@/components/dashboard/ActiveEmployeesView';
import {
  fetchDashboard,
  fetchFilters,
  fetchHealth,
  normalizeDashboardData,
  KpiFilters,
} from '@/lib/api';
import { toast } from 'sonner';

const Index = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<DashboardTab>('active-employees');
  const [activeFilters, setActiveFilters] = useState<KpiFilters>({});

  // Fetch available filters
  const {
    data: filters,
    isLoading: filtersLoading,
  } = useQuery({
    queryKey: ['filters'],
    queryFn: fetchFilters,
    staleTime: 300000,
    retry: 2,
  });

  // Fetch health status
  useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    staleTime: 60000,
    retry: 1,
  });

  // Fetch dashboard KPIs
  const {
    data: dashboard,
    isLoading: dashboardLoading,
  } = useQuery({
    queryKey: ['dashboard', activeFilters, activeTab],
    queryFn: () => fetchDashboard(activeFilters),
    staleTime: 60000,
    retry: 2,
  });

  // Normalize dashboard data for components
  const normalizedKpis = dashboard ? normalizeDashboardData(dashboard) : [];

  const handleFiltersChange = useCallback((newFilters: KpiFilters) => {
    setActiveFilters(newFilters);
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  }, [queryClient]);

  const handleTabChange = useCallback((tab: DashboardTab) => {
    setActiveTab(tab);
    setActiveFilters({});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Active Employees</h1>
          <p className="text-sm text-muted-foreground">
            Real time insights into employee status and eligibility metrics
          </p>
        </div>

        {/* Filters Row */}
        <FilterPanel
          filters={filters || null}
          activeFilters={activeFilters}
          onFiltersChange={handleFiltersChange}
          isLoading={filtersLoading}
        />

        {/* Tabs */}
        <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Content based on active tab */}
        {activeTab === 'active-employees' && (
          <ActiveEmployeesView
            kpis={normalizedKpis}
            isLoading={dashboardLoading}
          />
        )}

        {activeTab === 'department-eligibility' && (
          <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-card">
            <p className="text-muted-foreground">Department Eligibility view coming soon</p>
          </div>
        )}

        {activeTab === 'eligible-employees' && (
          <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-card">
            <p className="text-muted-foreground">Eligible Employees view coming soon</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
