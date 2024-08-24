import { prismaManager } from './client.js';

(async () => {
  try {
    await prismaManager.prodMigrate('public');
    const organizations =
      await prismaManager.rootPrismaClient.organization.findMany({
        select: {
          id: true,
        },
      });

    if (organizations && organizations.length >= 1) {
      await Promise.all(
        organizations.map((org) =>
          prismaManager.prodMigrate(`tenant_${org.id}`),
        ),
      );
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
