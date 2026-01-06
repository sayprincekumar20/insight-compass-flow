import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { KpiGrid } from '@/components/dashboard/KpiGrid';
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
  const { data: health } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
    staleTime: 60000,
    retry: 1,
  });

  // Fetch dashboard KPIs
  const {
    data: dashboard,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useQuery({
    queryKey: ['dashboard', activeFilters],
    queryFn: () => fetchDashboard(activeFilters),
    staleTime: 60000,
    retry: 2,
  });

  // Normalize dashboard data for components
  const normalizedKpis = dashboard ? normalizeDashboardData(dashboard) : [];

  const handleFiltersChange = useCallback((newFilters: KpiFilters) => {
    setActiveFilters(newFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['health'] });
    toast.success('Dashboard refreshed');
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        kpis={normalizedKpis}
        health={health || null}
        timestamp={dashboard?.timestamp || null}
        isLoading={dashboardLoading}
        onRefresh={handleRefresh}
      />

      <main className="container py-6">
        <div className="space-y-6">
          <FilterPanel
            filters={filters || null}
            activeFilters={activeFilters}
            onFiltersChange={handleFiltersChange}
            isLoading={filtersLoading}
          />

          <KpiGrid
            kpis={normalizedKpis}
            isLoading={dashboardLoading}
          />

          {dashboard && (
            <div className="flex items-center justify-center gap-4 py-4 text-sm text-muted-foreground">
              <span>
                {dashboard.ai_decision ? '🤖 AI-powered selection' : '📊 Standard view'}
              </span>
              <span>•</span>
              <span>
                {dashboard.successful_tools.length} tools executed
              </span>
              {dashboard.failed_tools.length > 0 && (
                <>
                  <span>•</span>
                  <span className="text-destructive">
                    {dashboard.failed_tools.length} failed
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
