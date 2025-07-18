"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { useConfirm } from "@/hooks/use-confirm";

import { toast } from "sonner";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

import { MeetingIdViewHeader } from "@/modules/meetings/ui/components/meeting-id-view-header";
import { UpdateMeetingDialog } from "@/modules/meetings/ui/components/update-meeting-dialog";

interface MeetingIdViewProps {
  meetingId: string;
}

export const MeetingIdView = ({ meetingId }: MeetingIdViewProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        //TODO: Invalidate free tier
        router.push("/meetings");
      },
      onError: (error) => toast.error(`Error: ${error.data?.code}`),
    }),
  );

  const [RemoveConfirmationDialog, confirmRemove] = useConfirm({
    title: "Are you sure",
    description: `The following action will remove this meeting`,
  });

  const onRemoveMeeting = async () => {
    const ok = await confirmRemove();
    if (!ok) return;

    await removeMeeting.mutateAsync({ id: meetingId });
  };

  return (
    <>
      <RemoveConfirmationDialog />
      <UpdateMeetingDialog
        initialValues={data}
        isOpen={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <div className="flex flex-1 flex-col gap-y-4 px-4 py-4 md:px-8">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => setShowEditDialog(true)}
          onRemove={onRemoveMeeting}
        />
        MeetingId: {meetingId}
      </div>
    </>
  );
};

export const MeetingIdLoadingView = () => (
  <LoadingState
    title="Loading Agent"
    description="This may take a few seconds..."
  />
);
export const MeetingIdErrorView = () => (
  <ErrorState title="Error" description="Something went wrong!" />
);
