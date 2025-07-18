"use client";

import { useState } from "react";

import { PlusIcon, XCircleIcon } from "lucide-react";

import { useAgentsFilters } from "@/modules/agents/hooks/use-agents-filter";

import { DEFAULT_PAGE } from "@/constants";

import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { AgentsSearchFilter } from "@/modules/agents/ui/components/agents-search-filter";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const AgentsListHeader = () => {
  const [showNewAgentDialog, setShowNewAgentDialog] = useState(false);
  const [filters, setFilters] = useAgentsFilters();

  const isFilterActive = !!filters.search;

  const onClearFilters = () =>
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
    });

  return (
    <>
      <NewAgentDialog
        isOpen={showNewAgentDialog}
        onOpenChange={setShowNewAgentDialog}
      />

      <div className="flex flex-col gap-y-4 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">My Agents</h5>

          <Button onClick={() => setShowNewAgentDialog(true)}>
            <PlusIcon />
            <span>New Agent</span>
          </Button>
        </div>

        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <AgentsSearchFilter />

            {isFilterActive && (
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                <XCircleIcon />
                <span>Clear</span>
              </Button>
            )}
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};
