import z from "zod";

import { db } from "@/db";
import { agents, user } from "@/db/schema";

import { agentsInsertSchema } from "../schemas";
import { eq, getTableColumns, sql } from "drizzle-orm";

import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [existingAgent] = await db
        .select({
          meetingCount: sql<number>`5`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(eq(agents.id, input.id));

      return existingAgent;
    }),

  getMany: protectedProcedure.query(async () => {
    const data = await db.select().from(agents);
    // Error test
    // throw new TRPCError({ code: "BAD_REQUEST" });

    return data;
  }),
  getManyUsers: baseProcedure.query(async () => {
    return await db.select().from(user);
  }),

  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({
          userId: ctx.auth.user.id,
          ...input,
        })
        .$returningId();

      return createdAgent;
    }),
});
