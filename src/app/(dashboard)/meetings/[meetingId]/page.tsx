import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";

import {
  MeetingIdErrorView,
  MeetingIdLoadingView,
  MeetingIdView,
} from "@/modules/meetings/ui/views/meeting-id-view";

interface MeetingIdPageProps {
  params: Promise<{ meetingId: string }>;
}

const MeetingIdPage = async ({ params }: MeetingIdPageProps) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const { meetingId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  // TODO: Prefetch `meetings.getTranscript`

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingIdLoadingView />}>
        <ErrorBoundary fallback={<MeetingIdErrorView />}>
          <MeetingIdView meetingId={meetingId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default MeetingIdPage;
