import { createTRPCRouter, baseProcedure } from "@/trpc/init";

import { db } from "@/db";
import { agents, user } from "@/db/schema";

import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(agents);
    // Error test
    // throw new TRPCError({ code: "BAD_REQUEST" });

    return data;
  }),
  getManyUsers: baseProcedure.query(async () => {
    return await db.select().from(user);
  }),
});
