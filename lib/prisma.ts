// Use runtime require to avoid TypeScript resolving `@prisma/client` types
// when the generated client files may not be present.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PrismaPkg: any = require("@prisma/client");

const globalForPrisma = global as unknown as { prisma?: any };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaPkg.PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
