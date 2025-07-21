import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";

import { auth } from "@/lib/auth";

import { VideoCallView } from "@/modules/meetings/ui/views/video-call-view";

interface CallPageProps {
  params: Promise<{ meetingId: string }>;
}

export const CallPage = async ({ params }: CallPageProps) => {
  const session = auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/sign-in");

  const { meetingId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryFilter({ id: meetingId }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p></p>}>
        <ErrorBoundary fallback={<p></p>}>
          <VideoCallView meetingId={meetingId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};
