import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";

import { db } from "@/db";
import { agents, user } from "@/db/schema";

import { TRPCError } from "@trpc/server";
import { agentsInsertSchema } from "../schemas";
import z from "zod";
import { eq } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
  // TODO: Change "getOne" to use protected procedure
  getOne: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.id));

      return existingAgent;
    }),

  // TODO: Change "getMany" to use protected procedure
  getMany: baseProcedure.query(async () => {
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
