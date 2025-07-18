import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";

export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"];
export type MeetingGetMany = inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"];
export enum MeetingStatus {
  Active = "active",
  Cancelled = "cancelled",
  Completed = "completed",
  Processing = "processing",
  Upcoming = "upcoming",
}
