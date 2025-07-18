import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";

import {
  AgentIdView,
  AgentsIdErrorView,
  AgentsIdLoadingView,
} from "@/modules/agents/ui/views/agent-id-view";

interface AgentIdPage {
  params: Promise<{ agentId: string }>;
}

const AgentIdPage = async ({ params }: AgentIdPage) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const { agentId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getOne.queryOptions({ id: agentId }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsIdLoadingView />}>
        <ErrorBoundary fallback={<AgentsIdErrorView />}>
          <AgentIdView agentId={agentId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default AgentIdPage;
