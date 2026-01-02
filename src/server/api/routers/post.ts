import { z } from "zod";

import {
  createRateLimitMiddleware,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { sendNewEntryNotification } from "~/server/email";
import { postCreationLimiter } from "~/server/ratelimit";

// Create a rate-limited procedure for post creation
const rateLimitedProcedure = publicProcedure.use(
  createRateLimitMiddleware(postCreationLimiter),
);

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: rateLimitedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        message: z.string().min(1).max(500),
        avatarSeed: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.create({
        data: {
          name: input.name,
          message: input.message,
          avatarSeed: input.avatarSeed ?? "",
          moderationStatus: "APPROVED", // Auto-approve new posts so they appear immediately
        },
      });

      // Send email notification asynchronously (fire and forget)
      // This won't block the response to the user
      sendNewEntryNotification({
        name: post.name,
        message: post.message,
        createdAt: post.createdAt,
      }).catch((error) => {
        console.error("Failed to send email notification:", error);
      });

      return post;
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return post ?? null;
  }),

  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.number().optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search } = input;

      // Build where clause - only show approved posts to public
      const where = {
        moderationStatus: "APPROVED" as const,
        ...(cursor ? { id: { lt: cursor } } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { message: { contains: search } },
              ],
            }
          : {}),
      };

      const posts = await ctx.db.post.findMany({
        take: limit + 1,
        where,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: number | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),

  update: rateLimitedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        message: z.string().min(1).max(500),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.update({
        where: { id: input.id },
        data: {
          name: input.name,
          message: input.message,
        },
      });
    }),

  delete: rateLimitedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.delete({
        where: { id: input.id },
      });
    }),

  // Admin/Moderation endpoints
  getAllForModeration: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.number().optional(),
        status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, status } = input;

      // Build where clause - show all posts for moderation
      const where = {
        ...(cursor ? { id: { lt: cursor } } : {}),
        ...(status ? { moderationStatus: status } : {}),
      };

      const posts = await ctx.db.post.findMany({
        take: limit + 1,
        where,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: number | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),

  moderate: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.update({
        where: { id: input.id },
        data: {
          moderationStatus: input.status,
        },
      });
    }),

  getModerationStats: publicProcedure.query(async ({ ctx }) => {
    const [pending, approved, rejected, total] = await Promise.all([
      ctx.db.post.count({ where: { moderationStatus: "PENDING" } }),
      ctx.db.post.count({ where: { moderationStatus: "APPROVED" } }),
      ctx.db.post.count({ where: { moderationStatus: "REJECTED" } }),
      ctx.db.post.count(),
    ]);

    return {
      pending,
      approved,
      rejected,
      total,
    };
  }),
});
