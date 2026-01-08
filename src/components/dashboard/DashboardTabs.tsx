import { Users, Building2, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DashboardTab = 'active-employees' | 'department-eligibility' | 'eligible-employees';

interface DashboardTabsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

const tabs = [
  { id: 'active-employees' as const, label: 'Active Employees', icon: Users },
  { id: 'department-eligibility' as const, label: 'Department Eligibility', icon: Building2 },
  { id: 'eligible-employees' as const, label: 'Eligible Employees', icon: UserCheck },
];

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-background hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
