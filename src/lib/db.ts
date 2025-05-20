import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const connectToDB = async () => {
  try {
    await prisma.$connect();
    return prisma;
  } catch (err) {
    console.error("\u26A0\uFE0F Prisma connection error:", err);
    throw err;
  }
};
