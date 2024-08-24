import { prismaManager } from './client.js';

(async () => {
  try {
    const organizations =
      await prismaManager.rootPrismaClient.organization.findMany({
        select: {
          id: true,
        },
      });

    await prismaManager.devPush('public');
    if (organizations && organizations.length >= 1) {
      await Promise.all(
        organizations.map((org) => prismaManager.devPush(`tenant_${org.id}`)),
      );
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
