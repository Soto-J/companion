"use client";

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
      {JSON.stringify(data, null, 2)}
    </div>
  );
};
