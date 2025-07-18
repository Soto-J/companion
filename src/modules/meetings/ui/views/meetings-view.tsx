"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filter";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { DataTable } from "@/components/data-table";
import { DataPagination } from "@/components/data-pagination";

import { Columns } from "@/modules/meetings/ui/components/columns";
import { useRouter } from "next/navigation";

export const MeetingsView = () => {
  const [filters, setFilters] = useMeetingsFilters();
  const router = useRouter();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({ ...filters }),
  );

  return (
    <div className="flex flex-1 flex-col gap-y-4 px-4 pb-4 md:px-8">
      <DataTable
        data={data.items}
        columns={Columns}
        onRowClick={(row) => router.push(`/meetings/${row.id}`)}
      />

      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
    </div>
  );
};

export const MeetingsLoadingView = () => (
  <LoadingState
    title="Loading Meetings"
    description="This may take a few seconds..."
  />
);
export const MeetingsErrorView = () => (
  <ErrorState
    title="Error Loading Meetings"
    description="Something went wrong!"
  />
);
