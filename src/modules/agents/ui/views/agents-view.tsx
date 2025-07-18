"use client";

import { useRouter } from "next/navigation";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAgentsFilters } from "@/modules/agents/hooks/use-agents-filter";

import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import { DataPagination } from "@/components/data-pagination";

import { DataTable } from "@/modules/agents/ui/components/data-table";
import { Columns } from "@/modules/agents/ui/components/columns";

export const AgentsView = () => {
  const [filters, setFilters] = useAgentsFilters();
  const router = useRouter();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({ ...filters }),
  );

  return (
    <div className="flex flex-1 flex-col gap-y-4 px-4 pb-4 md:px-8">
      <DataTable
        columns={Columns}
        data={data.items}
        onRowClick={(row) => router.push(`/agents/${row.id}`)}
      />

      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />

      {data.items.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call."
        />
      )}
    </div>
  );
};

// Error and Loading states
export const AgentsLoadingView = () => (
  <LoadingState
    title="Loading Agents"
    description="This may take a few seconds..."
  />
);
export const AgentsErrorView = () => (
  <ErrorState
    title="Error Loading Agents"
    description="Something went wrong!"
  />
);
