import z from "zod";

import { getTableColumns, and, eq, desc, count, like, sql } from "drizzle-orm";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { MeetingStatus } from "@/modules/meetings/types";

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MIN_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from "@/constants";

export const meetingRouter = createTRPCRouter({
  create: protectedProcedure
    .input(meetingsInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          userId: ctx.auth.user.id,
          ...input,
        })
        .$returningId();

      //TODO: Create stream call, Uppsert stream user
      return createdMeeting;
    }),

  edit: protectedProcedure
    .input(meetingsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const [updatedMeeting] = await db
        .update(meetings)
        .set(input)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)),
        );

      if (!updatedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return updatedMeeting;
    }),
  remove: protectedProcedure
    .input(meetingsInsertSchema)
    .mutation(async ({}) => {}),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [existingMeeting] = await db
        .select({ ...getTableColumns(meetings) })
        .from(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)),
        );

      if (!existingMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return existingMeeting;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z
          .enum([
            MeetingStatus.Active,
            MeetingStatus.Cancelled,
            MeetingStatus.Completed,
            MeetingStatus.Processing,
            MeetingStatus.Upcoming,
          ])
          .nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search, status, agentId } = input;

      const data = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`CASE
            WHEN ${meetings.endedAt} IS NOT NULL AND ${meetings.startedAt} IS NOT NULL
            THEN TIMESTAMPDIFF(SECOND, ${meetings.startedAt}, ${meetings.endedAt})
            ELSE NULL
            END`.as("duration"),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? like(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(agents.id, agentId) : undefined,
          ),
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            search ? like(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(agents.id, agentId) : undefined,
          ),
        );

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),
});
