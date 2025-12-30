import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { KpiGrid } from '@/components/dashboard/KpiGrid';
import {
  fetchDashboard,
  fetchDashboardSummary,
  fetchFilters,
  KpiFilters,
} from '@/lib/api';
import { toast } from 'sonner';

const Index = () => {
  const queryClient = useQueryClient();
  const [activeFilters, setActiveFilters] = useState<KpiFilters>({});

  // Fetch dashboard summary
  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary,
    staleTime: 60000,
    retry: 2,
  });

  // Fetch available filters
  const {
    data: filters,
    isLoading: filtersLoading,
    error: filtersError,
  } = useQuery({
    queryKey: ['filters'],
    queryFn: fetchFilters,
    staleTime: 300000,
    retry: 2,
  });

  // Fetch dashboard KPIs
  const {
    data: dashboard,
    isLoading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: ['dashboard', activeFilters],
    queryFn: () => fetchDashboard(activeFilters),
    staleTime: 60000,
    retry: 2,
  });

  // Handle errors
  useEffect(() => {
    if (summaryError || filtersError || dashboardError) {
      toast.error('Failed to load dashboard data. Please check your API connection.');
    }
  }, [summaryError, filtersError, dashboardError]);

  const handleFiltersChange = useCallback((newFilters: KpiFilters) => {
    setActiveFilters(newFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    toast.success('Dashboard refreshed');
  }, [queryClient]);

  const isLoading = summaryLoading || filtersLoading || dashboardLoading;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        summary={summary || null}
        isLoading={summaryLoading}
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
            kpis={dashboard?.dashboard_data || []}
            isLoading={dashboardLoading}
          />

          {dashboard && (
            <div className="flex items-center justify-center gap-4 py-4 text-sm text-muted-foreground">
              <span>
                Generated at:{' '}
                {new Date(dashboard.generated_at).toLocaleString()}
              </span>
              <span>•</span>
              <span>
                {dashboard.successful_kpis} of {dashboard.total_kpis} KPIs loaded
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
