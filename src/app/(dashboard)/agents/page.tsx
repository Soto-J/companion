import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";

import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import {
  AgentsLoadingView,
  AgentsErrorView,
  AgentsView,
} from "@/modules/agents/ui/views/agents-view";

const AgentsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/sign-in");

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
    <>
      <AgentsListHeader />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<AgentsLoadingView />}>
          <ErrorBoundary fallback={<AgentsErrorView />}>
            <AgentsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default AgentsPage;
