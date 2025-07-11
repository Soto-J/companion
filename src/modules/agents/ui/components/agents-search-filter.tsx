import { useDeferredValue } from "react";

import { SearchIcon } from "lucide-react";

import { useAgentsFilters } from "@/modules/agents/hooks/use-agents-filter";

import { Input } from "@/components/ui/input";

export const AgentsSearchFilter = () => {
  const [filters, setFilters] = useAgentsFilters();
  
  // This would defer the search state updates to avoid excessive filtering during rapid typing.
  const deferredSearch = useDeferredValue(filters.search); 

  return (
    <div className="relative">
      <Input
        placeholder="Filter by name"
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
        className="h-9 w-[200px] bg-white pl-7"
      />

      <SearchIcon className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
    </div>
  );
};
