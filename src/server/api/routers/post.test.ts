/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { type DeepMockProxy } from "vitest-mock-extended";
import { type PrismaClient } from "@prisma/client";
import { createMockDb, createTestCaller } from "~/test/helpers";

// Mock the email module
vi.mock("~/server/email", () => ({
  sendNewEntryNotification: vi.fn().mockResolvedValue(undefined),
}));

// Mock the rate limiter module
vi.mock("~/server/ratelimit", () => ({
  postCreationLimiter: {
    check: vi.fn().mockReturnValue({ success: true }),
  },
}));

describe("postRouter", () => {
  let mockDb: DeepMockProxy<PrismaClient>;
  let caller: ReturnType<typeof createTestCaller>;

  beforeEach(() => {
    mockDb = createMockDb();
    caller = createTestCaller(mockDb);
    vi.clearAllMocks();
  });

  describe("hello", () => {
    it("should return a greeting with the provided text", async () => {
      const result = await caller.post.hello({ text: "World" });

      expect(result).toEqual({
        greeting: "Hello World",
      });
    });

    it("should work with different input text", async () => {
      const result = await caller.post.hello({ text: "Vitest" });

      expect(result).toEqual({
        greeting: "Hello Vitest",
      });
    });
  });

  describe("create", () => {
    it("should create a new post with valid input", async () => {
      const mockPost = {
        id: 1,
        name: "John Doe",
        message: "Hello, world!",
        avatarSeed: "seed123",
        moderationStatus: "PENDING" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.post.create.mockResolvedValue(mockPost);

      const result = await caller.post.create({
        name: "John Doe",
        message: "Hello, world!",
        avatarSeed: "seed123",
      });

      expect(result).toEqual(mockPost);
      expect(mockDb.post.create).toHaveBeenCalledWith({
        data: {
          name: "John Doe",
          message: "Hello, world!",
          avatarSeed: "seed123",
        },
      });
    });

    it("should use empty string as default avatarSeed if not provided", async () => {
      const mockPost = {
        id: 1,
        name: "Jane Doe",
        message: "Test message",
        avatarSeed: "",
        moderationStatus: "PENDING" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.post.create.mockResolvedValue(mockPost);

      await caller.post.create({
        name: "Jane Doe",
        message: "Test message",
      });

      expect(mockDb.post.create).toHaveBeenCalledWith({
        data: {
          name: "Jane Doe",
          message: "Test message",
          avatarSeed: "",
        },
      });
    });

    it("should reject post with empty name", async () => {
      await expect(
        caller.post.create({
          name: "",
          message: "Test message",
        }),
      ).rejects.toThrow();
    });

    it("should reject post with empty message", async () => {
      await expect(
        caller.post.create({
          name: "John Doe",
          message: "",
        }),
      ).rejects.toThrow();
    });

    it("should reject post with message exceeding 500 characters", async () => {
      const longMessage = "a".repeat(501);

      await expect(
        caller.post.create({
          name: "John Doe",
          message: longMessage,
        }),
      ).rejects.toThrow();
    });
  });

  describe("getLatest", () => {
    it("should return the latest post", async () => {
      const mockPost = {
        id: 1,
        name: "John Doe",
        message: "Latest post",
        avatarSeed: "",
        moderationStatus: "APPROVED" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.post.findFirst.mockResolvedValue(mockPost);

      const result = await caller.post.getLatest();

      expect(result).toEqual(mockPost);
      expect(mockDb.post.findFirst).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return null if no posts exist", async () => {
      mockDb.post.findFirst.mockResolvedValue(null);

      const result = await caller.post.getLatest();

      expect(result).toBeNull();
    });
  });

  describe("getAll", () => {
    it("should return paginated posts with default limit", async () => {
      const mockPosts = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        message: `Message ${i + 1}`,
        avatarSeed: "",
        moderationStatus: "APPROVED" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockDb.post.findMany.mockResolvedValue(mockPosts);

      const result = await caller.post.getAll({});

      expect(result.posts).toHaveLength(10);
      expect(result.nextCursor).toBeUndefined();
      expect(mockDb.post.findMany).toHaveBeenCalledWith({
        take: 11,
        where: { moderationStatus: "APPROVED" },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return nextCursor if more posts exist", async () => {
      const mockPosts = Array.from({ length: 11 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        message: `Message ${i + 1}`,
        avatarSeed: "",
        moderationStatus: "APPROVED" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockDb.post.findMany.mockResolvedValue(mockPosts);

      const result = await caller.post.getAll({ limit: 10 });

      expect(result.posts).toHaveLength(10);
      expect(result.nextCursor).toBe(11);
    });

    it("should use cursor for pagination", async () => {
      const mockPosts = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        message: `Message ${i + 1}`,
        avatarSeed: "",
        moderationStatus: "APPROVED" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockDb.post.findMany.mockResolvedValue(mockPosts);

      await caller.post.getAll({ cursor: 10 });

      expect(mockDb.post.findMany).toHaveBeenCalledWith({
        take: 11,
        where: {
          moderationStatus: "APPROVED",
          id: { lt: 10 },
        },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should filter by search term", async () => {
      const mockPosts = [
        {
          id: 1,
          name: "John Doe",
          message: "Test message",
          avatarSeed: "",
          moderationStatus: "APPROVED" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockDb.post.findMany.mockResolvedValue(mockPosts);

      await caller.post.getAll({ search: "John" });

      expect(mockDb.post.findMany).toHaveBeenCalledWith({
        take: 11,
        where: {
          moderationStatus: "APPROVED",
          OR: [
            { name: { contains: "John" } },
            { message: { contains: "John" } },
          ],
        },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should only return approved posts", async () => {
      mockDb.post.findMany.mockResolvedValue([]);

      await caller.post.getAll({});

      expect(mockDb.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            moderationStatus: "APPROVED",
          }),
        }),
      );
    });
  });

  describe("update", () => {
    it("should update a post with valid input", async () => {
      const mockPost = {
        id: 1,
        name: "Updated Name",
        message: "Updated message",
        avatarSeed: "",
        moderationStatus: "APPROVED" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.post.update.mockResolvedValue(mockPost);

      const result = await caller.post.update({
        id: 1,
        name: "Updated Name",
        message: "Updated message",
      });

      expect(result).toEqual(mockPost);
      expect(mockDb.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          name: "Updated Name",
          message: "Updated message",
        },
      });
    });

    it("should reject update with empty name", async () => {
      await expect(
        caller.post.update({
          id: 1,
          name: "",
          message: "Test message",
        }),
      ).rejects.toThrow();
    });

    it("should reject update with message exceeding 500 characters", async () => {
      const longMessage = "a".repeat(501);

      await expect(
        caller.post.update({
          id: 1,
          name: "John Doe",
          message: longMessage,
        }),
      ).rejects.toThrow();
    });
  });

  describe("delete", () => {
    it("should delete a post by id", async () => {
      const mockPost = {
        id: 1,
        name: "John Doe",
        message: "Test message",
        avatarSeed: "",
        moderationStatus: "APPROVED" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.post.delete.mockResolvedValue(mockPost);

      const result = await caller.post.delete({ id: 1 });

      expect(result).toEqual(mockPost);
      expect(mockDb.post.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe("getAllForModeration", () => {
    it("should return all posts regardless of moderation status", async () => {
      const mockPosts = [
        {
          id: 1,
          name: "User 1",
          message: "Message 1",
          avatarSeed: "",
          moderationStatus: "PENDING" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "User 2",
          message: "Message 2",
          avatarSeed: "",
          moderationStatus: "APPROVED" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockDb.post.findMany.mockResolvedValue(mockPosts);

      const result = await caller.post.getAllForModeration({});

      expect(result.posts).toHaveLength(2);
      expect(mockDb.post.findMany).toHaveBeenCalledWith({
        take: 11,
        where: {},
        orderBy: { createdAt: "desc" },
      });
    });

    it("should filter by moderation status", async () => {
      mockDb.post.findMany.mockResolvedValue([]);

      await caller.post.getAllForModeration({ status: "PENDING" });

      expect(mockDb.post.findMany).toHaveBeenCalledWith({
        take: 11,
        where: { moderationStatus: "PENDING" },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should support pagination with cursor", async () => {
      mockDb.post.findMany.mockResolvedValue([]);

      await caller.post.getAllForModeration({ cursor: 5 });

      expect(mockDb.post.findMany).toHaveBeenCalledWith({
        take: 11,
        where: { id: { lt: 5 } },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("moderate", () => {
    it("should update post moderation status to APPROVED", async () => {
      const mockPost = {
        id: 1,
        name: "User 1",
        message: "Message 1",
        avatarSeed: "",
        moderationStatus: "APPROVED" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.post.update.mockResolvedValue(mockPost);

      const result = await caller.post.moderate({ id: 1, status: "APPROVED" });

      expect(result).toEqual(mockPost);
      expect(mockDb.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { moderationStatus: "APPROVED" },
      });
    });

    it("should update post moderation status to REJECTED", async () => {
      const mockPost = {
        id: 1,
        name: "User 1",
        message: "Message 1",
        avatarSeed: "",
        moderationStatus: "REJECTED" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.post.update.mockResolvedValue(mockPost);

      await caller.post.moderate({ id: 1, status: "REJECTED" });

      expect(mockDb.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { moderationStatus: "REJECTED" },
      });
    });

    it("should update post moderation status to PENDING", async () => {
      const mockPost = {
        id: 1,
        name: "User 1",
        message: "Message 1",
        avatarSeed: "",
        moderationStatus: "PENDING" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDb.post.update.mockResolvedValue(mockPost);

      await caller.post.moderate({ id: 1, status: "PENDING" });

      expect(mockDb.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { moderationStatus: "PENDING" },
      });
    });
  });

  describe("getModerationStats", () => {
    it("should return moderation statistics", async () => {
      mockDb.post.count
        .mockResolvedValueOnce(5) // pending
        .mockResolvedValueOnce(10) // approved
        .mockResolvedValueOnce(2) // rejected
        .mockResolvedValueOnce(17); // total

      const result = await caller.post.getModerationStats();

      expect(result).toEqual({
        pending: 5,
        approved: 10,
        rejected: 2,
        total: 17,
      });

      expect(mockDb.post.count).toHaveBeenCalledTimes(4);
      expect(mockDb.post.count).toHaveBeenNthCalledWith(1, {
        where: { moderationStatus: "PENDING" },
      });
      expect(mockDb.post.count).toHaveBeenNthCalledWith(2, {
        where: { moderationStatus: "APPROVED" },
      });
      expect(mockDb.post.count).toHaveBeenNthCalledWith(3, {
        where: { moderationStatus: "REJECTED" },
      });
      expect(mockDb.post.count).toHaveBeenNthCalledWith(4);
    });

    it("should return zeros when no posts exist", async () => {
      mockDb.post.count.mockResolvedValue(0);

      const result = await caller.post.getModerationStats();

      expect(result).toEqual({
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0,
      });
    });
  });
});
