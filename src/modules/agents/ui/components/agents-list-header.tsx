"use client";

import { useState } from "react";

import { PlusIcon, XCircleIcon } from "lucide-react";

import { useAgentsFilters } from "@/modules/agents/hooks/use-agents-filter";

import { DEFAULT_PAGE } from "@/constants";

import { Button } from "@/components/ui/button";

import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { AgentsSearchFilter } from "@/modules/agents/ui/components/agents-search-filter";

export const AgentsListHeader = () => {
  const [filters, setFilters] = useAgentsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isFilterActive = !!filters.search;

  const onClearFilters = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewAgentDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className="flex flex-col gap-y-4 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">My Agents</h5>

          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            <span>New Agent</span>
          </Button>
        </div>

        <div className="flex items-center gap-x-2 p-1">
          <AgentsSearchFilter />

          {isFilterActive && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <XCircleIcon />
              <span>Clear</span>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
