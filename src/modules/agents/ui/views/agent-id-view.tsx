"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { VideoIcon } from "lucide-react";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

import { Badge } from "@/components/ui/badge";
import { AgentIdViewHeader } from "@/modules/agents/ui/components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";

interface AgentIdViewProps {
  agentId: string;
}

export const AgentIdView = ({ agentId }: AgentIdViewProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId }),
  );

  return (
    <div className="flex flex-1 flex-col gap-y-4 p-4 md:px-8">
      <AgentIdViewHeader
        agentId={agentId}
        agentName={data.name}
        onEdit={() => {}}
        onRemove={() => {}}
      />
      <div className="rounded-lg border bg-white">
        <div className="col-span-5 flex flex-col gap-y-5 px-4 py-5">
          <div className="flex items-center gap-x-3">
            <GeneratedAvatar
              seed={data.name}
              variant="botttsNeutral"
              className="size-10"
            />
          </div>

          <h2 className="text-2xl font-medium">{data.name}</h2>
          <Badge
            variant="outline"
            className="flex items-center gap-x-2 [&>svg]:size-4"
          >
            <VideoIcon className="text-blue-700" />
            <span>{data.meetingCount}</span>
            <span>{data.meetingCount === 1 ? "meeting" : "meetings"}</span>
          </Badge>

          <div className="flex flex-col gap-y-4">
            <p className="text-lg font-medium">Instructions</p>
            <p className="text-neutral-800">{data.instructions}</p>
          </div>

          {JSON.stringify(data, null, 2)}
        </div>
      </div>
    </div>
  );
};

// Error and Loading states
export const AgentsIdLoadingView = () => (
  <LoadingState
    title="Loading Agent"
    description="This may take a few seconds..."
  />
);
export const AgentsIdErrorView = () => (
  <ErrorState title="Error" description="Something went wrong!" />
);
