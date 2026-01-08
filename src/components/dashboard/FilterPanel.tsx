import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FiltersResponse, KpiFilters } from '@/lib/api';
import { format, parse, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

interface FilterPanelProps {
  filters: FiltersResponse | null;
  activeFilters: KpiFilters;
  onFiltersChange: (filters: KpiFilters) => void;
  isLoading: boolean;
}

export function FilterPanel({
  filters,
  activeFilters,
  onFiltersChange,
  isLoading,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<KpiFilters>(activeFilters);

  // Sync local filters with active filters when they change externally
  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  const handleDepartmentToggle = (value: string) => {
    const current = localFilters.departments || [];
    const updated = current.includes(value)
      ? current.filter((d) => d !== value)
      : [...current, value];
    const newFilters = { ...localFilters, departments: updated };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleLocationToggle = (value: string) => {
    const current = localFilters.locations || [];
    const updated = current.includes(value)
      ? current.filter((l) => l !== value)
      : [...current, value];
    const newFilters = { ...localFilters, locations: updated };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDesignationToggle = (value: string) => {
    const current = localFilters.designations || [];
    const updated = current.includes(value)
      ? current.filter((d) => d !== value)
      : [...current, value];
    const newFilters = { ...localFilters, designations: updated };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleGenderToggle = (value: string) => {
    if (value === 'all') {
      const newFilters = { ...localFilters, gender: undefined };
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
      return;
    }
    const current = localFilters.gender || [];
    const updated = current.includes(value)
      ? current.filter((g) => g !== value)
      : [...current, value];
    const newFilters = { ...localFilters, gender: updated.length ? updated : undefined };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (value === 'all') {
      const newFilters = {
        ...localFilters,
        [type === 'start' ? 'start_date' : 'end_date']: undefined,
      };
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
      return;
    }
    const newFilters = {
      ...localFilters,
      [type === 'start' ? 'start_date' : 'end_date']: value,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const empty: KpiFilters = {};
    setLocalFilters(empty);
    onFiltersChange(empty);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.departments?.length) count += localFilters.departments.length;
    if (localFilters.locations?.length) count += localFilters.locations.length;
    if (localFilters.designations?.length) count += localFilters.designations.length;
    if (localFilters.gender?.length) count += localFilters.gender.length;
    if (localFilters.start_date) count += 1;
    if (localFilters.end_date) count += 1;
    return count;
  };

  const activeCount = getActiveFilterCount();

  // Generate month options from date range
  const getMonthOptions = () => {
    if (!filters?.date_range?.min_date || !filters?.date_range?.max_date) {
      return [];
    }
    try {
      const minDate = parse(filters.date_range.min_date, 'yyyy-MM-dd HH:mm:ss', new Date());
      const maxDate = parse(filters.date_range.max_date, 'yyyy-MM-dd HH:mm:ss', new Date());
      const months = eachMonthOfInterval({ start: startOfMonth(minDate), end: endOfMonth(maxDate) });
      return months.map((date) => ({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'MMM yyyy'),
      }));
    } catch {
      return [];
    }
  };

  const monthOptions = getMonthOptions();

  const getDisplayLabel = (filterType: string) => {
    switch (filterType) {
      case 'departments':
        return localFilters.departments?.length
          ? localFilters.departments.length === 1
            ? localFilters.departments[0]
            : `${localFilters.departments.length} selected`
          : 'All Departments';
      case 'locations':
        return localFilters.locations?.length
          ? localFilters.locations.length === 1
            ? localFilters.locations[0]
            : `${localFilters.locations.length} selected`
          : 'All Locations';
      case 'designations':
        return localFilters.designations?.length
          ? localFilters.designations.length === 1
            ? localFilters.designations[0]
            : `${localFilters.designations.length} selected`
          : 'All Designations';
      case 'gender':
        return localFilters.gender?.length
          ? localFilters.gender.length === 1
            ? localFilters.gender[0]
            : `${localFilters.gender.length} selected`
          : 'All Genders';
      default:
        return 'All';
    }
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  return (
    <div className="flex flex-wrap items-end gap-3 py-4">
      {/* Department Filter */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Department</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 min-w-[120px] justify-between bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              disabled={isLoading || !filters}
            >
              <span className="truncate text-sm">{getDisplayLabel('departments')}</span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <ScrollArea className="h-[280px]">
              <div className="p-3 space-y-2">
                {filters?.departments.map((dept) => (
                  <div key={dept.value} className="flex items-center space-x-3 py-1">
                    <Checkbox
                      id={`dept-${dept.value}`}
                      checked={localFilters.departments?.includes(dept.value)}
                      onCheckedChange={() => handleDepartmentToggle(dept.value)}
                    />
                    <Label
                      htmlFor={`dept-${dept.value}`}
                      className="flex-1 text-sm font-normal cursor-pointer"
                    >
                      {dept.value}
                      <span className="ml-2 text-muted-foreground">
                        ({dept.count?.toLocaleString()})
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>

      {/* Location Filter */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Location</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 min-w-[100px] justify-between bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              disabled={isLoading || !filters}
            >
              <span className="truncate text-sm">{getDisplayLabel('locations')}</span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <ScrollArea className="h-[280px]">
              <div className="p-3 space-y-2">
                {filters?.locations.slice(0, 30).map((loc) => (
                  <div key={loc.value} className="flex items-center space-x-3 py-1">
                    <Checkbox
                      id={`loc-${loc.value}`}
                      checked={localFilters.locations?.includes(loc.value)}
                      onCheckedChange={() => handleLocationToggle(loc.value)}
                    />
                    <Label
                      htmlFor={`loc-${loc.value}`}
                      className="flex-1 text-sm font-normal cursor-pointer"
                    >
                      {loc.value}
                      <span className="ml-2 text-muted-foreground">
                        ({loc.count?.toLocaleString()})
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>

      {/* Gender Filter - Multi-select */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Gender</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 min-w-[80px] justify-between bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              disabled={isLoading || !filters}
            >
              <span className="truncate text-sm">{getDisplayLabel('gender')}</span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-0" align="start">
            <div className="p-3 space-y-2">
              {filters?.genders
                .filter((g) => g.value !== 'all')
                .map((g) => (
                  <div key={g.value} className="flex items-center space-x-3 py-1">
                    <Checkbox
                      id={`gender-${g.value}`}
                      checked={localFilters.gender?.includes(g.value) || false}
                      onCheckedChange={() => handleGenderToggle(g.value)}
                    />
                    <Label
                      htmlFor={`gender-${g.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {g.label}
                    </Label>
                  </div>
                ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Issuance Month - From */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Issuance Month</Label>
        <Select
          value={localFilters.start_date || 'all'}
          onValueChange={(value) => handleDateChange('start', value)}
          disabled={isLoading || !filters}
        >
          <SelectTrigger className="h-9 w-[110px]">
            <SelectValue placeholder="Jan 2024" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {monthOptions.slice(-24).map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* To label */}
      <span className="text-sm text-muted-foreground pb-2">to</span>

      {/* Issuance Month - To */}
      <div className="flex flex-col gap-1.5">
        <Select
          value={localFilters.end_date || 'all'}
          onValueChange={(value) => handleDateChange('end', value)}
          disabled={isLoading || !filters}
        >
          <SelectTrigger className="h-9 w-[110px]">
            <SelectValue placeholder="Dec 2024" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {monthOptions.slice(-24).map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Apply Filters Button */}
      <Button
        onClick={applyFilters}
        size="sm"
        className="h-9 px-6"
        disabled={isLoading}
      >
        Apply Filters
      </Button>
    </div>
  );
}
