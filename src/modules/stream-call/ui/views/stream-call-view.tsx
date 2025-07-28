"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { StreamCallProvider } from "../components/stream-call-provider";

interface VideoCallViewProps {
  meetingId: string;
}

export const StreamCallView = ({ meetingId }: VideoCallViewProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  if (data.status === "completed") {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorState
          title="Meeting has ended"
          description="You can no longer join this meeting"
        />
      </div>
    );
  }

  return <StreamCallProvider meetingId={data.id} meetingName={data.name} />;
};

export const StreamCallLoadingView = () => (
  <LoadingState
    title="Loading Stream Call"
    description="This may take a few seconds..."
  />
);
export const StreamCallErrorView = () => (
  <ErrorState
    title="Error Loading Stream Call"
    description="Something went wrong!"
  />
);
