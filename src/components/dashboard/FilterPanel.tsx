import { useState } from 'react';
import { Filter, X, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FiltersResponse, KpiFilters } from '@/lib/api';

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

  const handleDepartmentToggle = (value: string) => {
    const current = localFilters.departments || [];
    const updated = current.includes(value)
      ? current.filter((d) => d !== value)
      : [...current, value];
    setLocalFilters({ ...localFilters, departments: updated });
  };

  const handleLocationToggle = (value: string) => {
    const current = localFilters.locations || [];
    const updated = current.includes(value)
      ? current.filter((l) => l !== value)
      : [...current, value];
    setLocalFilters({ ...localFilters, locations: updated });
  };

  const handleDesignationToggle = (value: string) => {
    const current = localFilters.designations || [];
    const updated = current.includes(value)
      ? current.filter((d) => d !== value)
      : [...current, value];
    setLocalFilters({ ...localFilters, designations: updated });
  };

  const handleGenderChange = (value: string) => {
    setLocalFilters({ ...localFilters, gender: value === 'all' ? undefined : value });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
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
    if (localFilters.gender) count += 1;
    return count;
  };

  const activeCount = getActiveFilterCount();

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card animate-slide-up">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeCount}
            </Badge>
          )}
        </div>

        {/* Department Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              disabled={isLoading || !filters}
            >
              Department
              {localFilters.departments?.length ? (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {localFilters.departments.length}
                </Badge>
              ) : null}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <ScrollArea className="h-[280px]">
              <div className="p-4 space-y-3">
                {filters?.departments.map((dept) => (
                  <div key={dept.value} className="flex items-center space-x-3">
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

        {/* Location Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              disabled={isLoading || !filters}
            >
              Location
              {localFilters.locations?.length ? (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {localFilters.locations.length}
                </Badge>
              ) : null}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <ScrollArea className="h-[280px]">
              <div className="p-4 space-y-3">
                {filters?.locations.slice(0, 20).map((loc) => (
                  <div key={loc.value} className="flex items-center space-x-3">
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

        {/* Designation Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              disabled={isLoading || !filters}
            >
              Designation
              {localFilters.designations?.length ? (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {localFilters.designations.length}
                </Badge>
              ) : null}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <ScrollArea className="h-[280px]">
              <div className="p-4 space-y-3">
                {filters?.designations.slice(0, 20).map((desig) => (
                  <div key={desig.value} className="flex items-center space-x-3">
                    <Checkbox
                      id={`desig-${desig.value}`}
                      checked={localFilters.designations?.includes(desig.value)}
                      onCheckedChange={() => handleDesignationToggle(desig.value)}
                    />
                    <Label
                      htmlFor={`desig-${desig.value}`}
                      className="flex-1 text-sm font-normal cursor-pointer"
                    >
                      {desig.value}
                      <span className="ml-2 text-muted-foreground">
                        ({desig.count?.toLocaleString()})
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Gender Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              disabled={isLoading || !filters}
            >
              Gender
              {localFilters.gender ? (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  1
                </Badge>
              ) : null}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48" align="start">
            <RadioGroup
              value={localFilters.gender || 'all'}
              onValueChange={handleGenderChange}
              className="space-y-3"
            >
              {filters?.genders.map((g) => (
                <div key={g.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={g.value} id={`gender-${g.value}`} />
                  <Label
                    htmlFor={`gender-${g.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {g.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </PopoverContent>
        </Popover>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={applyFilters}
            disabled={isLoading}
            className="h-9"
          >
            <Check className="mr-2 h-4 w-4" />
            Apply
          </Button>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              disabled={isLoading}
              className="h-9"
            >
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
