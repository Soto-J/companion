"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { DataTable } from "@/components/data-table";
import { Columns } from "@/modules/meetings/ui/components/columns";

export const MeetingsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

  return (
    <div>
      <DataTable data={data.items} columns={Columns} />
      <div>{JSON.stringify(data, null, 2)}</div>
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
