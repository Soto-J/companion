import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

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
