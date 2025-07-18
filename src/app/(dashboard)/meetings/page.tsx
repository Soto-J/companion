import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { ErrorBoundary } from "react-error-boundary";

import { SearchParams } from "nuqs";

import { auth } from "@/lib/auth";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { loadSearchParams } from "@/modules/meetings/params";

import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header";

import {
  MeetingsErrorView,
  MeetingsLoadingView,
  MeetingsView,
} from "@/modules/meetings/ui/views/meetings-view";

interface MeetingsPageProps {
  searchParams: Promise<SearchParams>;
}

const MeetingsPage = async ({ searchParams }: MeetingsPageProps) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const filters = await loadSearchParams(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({ ...filters }),
  );

  return (
    <>
      <MeetingsListHeader />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MeetingsLoadingView />}>
          <ErrorBoundary fallback={<MeetingsErrorView />}>
            <MeetingsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default MeetingsPage;
