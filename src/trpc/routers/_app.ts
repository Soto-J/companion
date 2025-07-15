import { createTRPCRouter } from "../init";

import { agentsRouter } from "@/modules/agents/server/procedures";
import { meetingRouter } from "@/modules/meetings/server/procedures";

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meetings: meetingRouter,
});

export type AppRouter = typeof appRouter;
