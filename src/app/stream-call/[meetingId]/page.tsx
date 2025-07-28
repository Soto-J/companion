import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";

import { auth } from "@/lib/auth";

import {
  StreamCallView,
  StreamCallErrorView,
  StreamCallLoadingView,
} from "@/modules/stream-call/ui/views/stream-call-view";

interface StreamCallPageProps {
  params: Promise<{ meetingId: string }>;
}

const StreamCallPage = async ({ params }: StreamCallPageProps) => {
  const session = auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/sign-in");

  const { meetingId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<StreamCallLoadingView />}>
        <ErrorBoundary fallback={<StreamCallErrorView />}>
          <StreamCallView meetingId={meetingId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default StreamCallPage;
