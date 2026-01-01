import { type PrismaClient } from "@prisma/client";
import { type DeepMockProxy, mockDeep } from "vitest-mock-extended";
import { appRouter } from "~/server/api/root";
import { createCallerFactory } from "~/server/api/trpc";

/**
 * Create a mock Prisma client for testing
 */
export const createMockDb = (): DeepMockProxy<PrismaClient> => {
  return mockDeep<PrismaClient>();
};

/**
 * Create a test tRPC caller with a mock database
 */
export const createTestCaller = (db: DeepMockProxy<PrismaClient>) => {
  const createCaller = createCallerFactory(appRouter);

  return createCaller({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    db,
    clientIp: "127.0.0.1",
    headers: new Headers(),
  });
};
