import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";

import type { SearchParams } from "nuqs";

import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { loadSearchParams } from "@/modules/agents/params";

import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import {
  AgentsLoadingView,
  AgentsErrorView,
  AgentsView,
} from "@/modules/agents/ui/views/agents-view";

interface AgentsPageProps {
  searchParams: Promise<SearchParams>;
}

const AgentsPage = async ({ searchParams }: AgentsPageProps) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const filters = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getMany.queryOptions({ ...filters }),
  );

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
