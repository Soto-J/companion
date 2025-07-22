"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface VideoCallViewProps {
  meetingId: string;
}

export const VideoCallView = ({ meetingId }: VideoCallViewProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryFilter({ id: meetingId }),
  );

  return (
    <div>
      video call view
    </div>
  );
};

export const VideoCallLoadingView = () => (
  <LoadingState
    title="Loading Video Call"
    description="This may take a few seconds..."
  />
);
export const VideoCallErrorView = () => (
  <ErrorState
    title="Error Loading Video Call"
    description="Something went wrong!"
  />
);