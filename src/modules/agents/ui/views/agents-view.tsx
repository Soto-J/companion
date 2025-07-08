"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

export const AgentsView = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  console.log({ data });
  return (
    <div>
      <div>{JSON.stringify(data, null, 2)}</div>
    </div>
  );
};

export const AgentsLoadingView = () => (
  <LoadingState
    title="Loading Agents"
    description="This may take a few seconds..."
  />
);
export const AgentsErrorView = () => (
  <ErrorState title="Error" description="Something went wrong!" />
);
