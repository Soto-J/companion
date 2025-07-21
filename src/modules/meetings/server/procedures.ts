import z from "zod";

import { getTableColumns, and, eq, desc, count, like, sql } from "drizzle-orm";

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MIN_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from "@/constants";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import {
  meetingsInsertSchema,
  meetingsRemoveSchema,
  meetingsUpdateSchema,
} from "@/modules/meetings/schemas";
import { MeetingStatus } from "@/modules/meetings/types";

import { streamVideoClient } from "@/lib/stream-video-client";
import { generateAvatarUri } from "@/lib/generate-avatar-uri";

export const meetingRouter = createTRPCRouter({
  create: protectedProcedure
    .input(meetingsInsertSchema)
    .mutation(async ({ ctx, input }) => {
      // Create meeting
      const [{ id: createdMeetingId }] = await db
        .insert(meetings)
        .values({
          userId: ctx.auth.user.id,
          ...input,
        })
        .$returningId();

      const createdMeetingName = db
        .select({ name: getTableColumns(meetings).name })
        .from(meetings)
        .where(eq(meetings.id, createdMeetingId));

      // Create stream call
      const call = streamVideoClient.video.call("default", createdMeetingId);
      await call.create({
        data: {
          created_by_id: ctx.auth.user.id,
          custom: {
            meetingId: createdMeetingId,
            meetingName: createdMeetingName,
          },
          settings_override: {
            transcription: {
              language: "en",
              mode: "auto-on",
              closed_caption_mode: "auto-on",
            },
            recording: {
              mode: "auto-on",
              quality: "1080p",
            },
          },
        },
      });

      const [meetingCreator] = await db
        .select({
          id: getTableColumns(agents).id,
          name: getTableColumns(agents).name,
        })
        .from(agents)
        .where(eq(agents.id, createdMeetingId));

      if (!meetingCreator) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }

      // Put meeting creator into call
      await streamVideoClient.upsertUsers([
        {
          ...meetingCreator,
          role: "user",
          image: generateAvatarUri({
            seed: meetingCreator.name,
            varient: "botttsNeutral",
          }),
        },
      ]);

      return { createdMeetingId, createdMeetingName };
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
    .input(meetingsRemoveSchema)
    .mutation(async ({ ctx, input }) => {
      const [deletedMeeting] = await db
        .delete(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)),
        );

      if (!deletedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }

      return deletedMeeting;
    }),

  generateToken: protectedProcedure.mutation(async ({ ctx }) => {
    await streamVideoClient.upsertUsers([
      {
        id: ctx.auth.user.id,
        name: ctx.auth.user.name,
        role: "admin",
        image:
          ctx.auth.user?.image ??
          generateAvatarUri({ seed: ctx.auth.user.name, varient: "initials" }),
      },
    ]);

    const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour
    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    return streamVideoClient.generateUserToken({
      user_id: ctx.auth.user.id,
      exp: expirationTime,
      validity_in_seconds: issuedAt,
    });
  }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [existingMeeting] = await db
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
        .innerJoin(agents, eq(agents.id, meetings.agentId))
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
