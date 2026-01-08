import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type DashboardTab = 'active-employees' | 'department-eligibility' | 'eligible-employees';

interface DashboardTabsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as DashboardTab)} className="mb-6">
      <TabsList className="h-auto p-1 bg-muted/50">
        <TabsTrigger 
          value="active-employees" 
          className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Active Employees
        </TabsTrigger>
        <TabsTrigger 
          value="department-eligibility" 
          className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Department Eligibility
        </TabsTrigger>
        <TabsTrigger 
          value="eligible-employees" 
          className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Eligible Employees
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
