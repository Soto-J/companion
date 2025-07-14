"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { VideoIcon } from "lucide-react";
import { toast } from "sonner";

import { useConfirm } from "@/hooks/use-confirm";

import { AgentIdViewHeader } from "@/modules/agents/ui/components/agent-id-view-header";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { Badge } from "@/components/ui/badge";
import { GeneratedAvatar } from "@/components/generated-avatar";

import { UpdateAgentDialog } from "@/modules/agents/ui/components/update-agent-dialog";

interface AgentIdViewProps {
  agentId: string;
}

export const AgentIdView = ({ agentId }: AgentIdViewProps) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  
  const router = useRouter();
  const queryClient = useQueryClient();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId }),
  );

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        );

        // TODO: Invalidate free tier usage
        router.push("/agents");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const [RemoveConfirmationDialog, confirmRemove] = useConfirm({
    title: "Are you sure",
    description: `The following action will remove ${data.name} along with ${data.meetingCount} ${data.meetingCount === 1 ? "meeting" : "meetings"}`,
  });

  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();
    if (!ok) return;

    await removeAgent.mutateAsync({ id: agentId });
  };

  return (
    <>
      <RemoveConfirmationDialog />
      <UpdateAgentDialog
        initialValues={data}
        isOpen={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />

      <div className="flex flex-1 flex-col gap-y-4 p-4 md:px-8">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => setIsUpdateDialogOpen(true)}
          onRemove={handleRemoveAgent}
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
    </>
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
