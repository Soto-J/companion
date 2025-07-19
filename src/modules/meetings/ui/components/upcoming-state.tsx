import Link from "next/link";

import { BanIcon, VideoIcon } from "lucide-react";

import { EmptyState } from "@/components/empty-state";

import { Button } from "@/components/ui/button";

interface UpcomingStateProps {
  meetingId: string;
  isCancelling: boolean;
  onCancelMeeting: () => void;
}

export const UpcomingState = ({
  meetingId,
  isCancelling,
  onCancelMeeting,
}: UpcomingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-8 rounded-lg bg-white px-4 py-5">
      <EmptyState
        image="/upcoming.svg"
        title="Not Started yet"
        description="Once you start this meeting, a summary will appear here"
      />

      <div className="flex w-full flex-col-reverse items-center gap-2 lg:flex-row lg:justify-center">
        <Button
          disabled={isCancelling}
          onClick={onCancelMeeting}
          variant="secondary"
          className="w-full lg:w-auto"
        >
          <BanIcon />
          Cancel meeting
        </Button>

        <Button asChild disabled={isCancelling} className="w-full lg:w-auto">
          <Link href={`/call/${meetingId}`}>
            <VideoIcon />
            Start meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
