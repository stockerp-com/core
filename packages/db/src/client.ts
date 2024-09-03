import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { exec } from 'child_process';
import { promisify } from 'util';

const createMultitenantPrismaManager = () => {
  const prismaLog: Prisma.LogDefinition[] = [
    { emit: 'stdout', level: 'query' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
    { emit: 'stdout', level: 'error' },
  ];

  const clients = new Map<number, { client: PrismaClient; lastUsed: number }>();
  const inactivityThreshold = 30 * 60 * 1000; // 30 minutes
  const cleanupInterval = 5 * 60 * 1000; // 5 minutes
  const rootPrismaClient = new PrismaClient({
    log: prismaLog,
  });

  const cleanupInactiveClients = async () => {
    const now = Date.now();
    for (const [tenantId, { client, lastUsed }] of clients.entries()) {
      if (now - lastUsed > inactivityThreshold) {
        await client.$disconnect();
        clients.delete(tenantId);
      }
    }
  };

  setInterval(cleanupInactiveClients, cleanupInterval);

  const getClient = async (tenantId: number): Promise<PrismaClient> => {
    const existingClient = clients.get(tenantId);
    if (existingClient) {
      existingClient.lastUsed = Date.now();
      return existingClient.client;
    }

    const newClient = new PrismaClient({
      datasources: {
        db: {
          url: `${process.env.DATABASE_URL}?schema=${`tenant_${tenantId}`}`,
        },
      },
      log: prismaLog,
    });

    await newClient.$connect();
    clients.set(tenantId, { client: newClient, lastUsed: Date.now() });
    return newClient;
  };

  const disconnectAll = async () => {
    for (const { client } of clients.values()) {
      await client.$disconnect();
    }
    clients.clear();
    await rootPrismaClient.$disconnect();
  };

  const createTenantSchema = async (tenantId: number): Promise<void> => {
    try {
      await rootPrismaClient.$executeRaw`CREATE SCHEMA IF NOT EXISTS "${Prisma.raw(`tenant_${tenantId}`)}"`;
      await getClient(tenantId);
      console.log(`Schema created successfully for tenant: ${tenantId}`);
    } catch (error) {
      console.error(`Error creating schema for tenant ${tenantId}:`, error);
      throw error;
    }
  };

  const destroyTenantSchema = async (tenantId: number): Promise<void> => {
    try {
      await disconnectTenantClient(tenantId);
      await rootPrismaClient.$executeRaw`DROP SCHEMA IF EXISTS "${Prisma.raw(`tenant_${tenantId}`)}" CASCADE`;
      console.log(`Schema destroyed successfully for tenant: ${tenantId}`);
    } catch (error) {
      console.error(`Error destroying schema for tenant ${tenantId}:`, error);
      throw error;
    }
  };

  const disconnectTenantClient = async (tenantId: number): Promise<void> => {
    const clientData = clients.get(tenantId);
    if (clientData) {
      await clientData.client.$disconnect();
      clients.delete(tenantId);
    }
  };

  const devPush = async (schema: string, prismaSchema?: string) => {
    console.log(`[ ${schema} ] START PUSHING SCHEMA...`);
    if (prismaSchema) {
      return promisify(exec)(
        `DATABASE_URL=${`${process.env.DATABASE_URL}?schema=${schema}`} npx prisma db push --schema=${prismaSchema}`,
      );
    }
    return promisify(exec)(
      `DATABASE_URL=${`${process.env.DATABASE_URL}?schema=${schema}`} npx prisma db push`,
    )
      .then(() => console.log(`[ ${schema} ] SUCCESSFULLY PUSHED SCHEMA`))
      .catch((error) =>
        console.error(`[ ${schema} ] FAILED PUSHING SCHEMA :(`, error),
      );
  };

  const prodMigrate = async (schema: string, prismaSchema?: string) => {
    console.log(`[ ${schema} ] START MIGRATING SCHEMA...`);
    if (prismaSchema) {
      return promisify(exec)(
        `DATABASE_URL=${`${process.env.DATABASE_URL}?schema=${schema}`} npx prisma migrate deploy --schema=${prismaSchema}`,
      )
        .then(() => console.log(`[ ${schema} ] SUCCESSFULLY MIGRATED SCHEMA`))
        .catch((error) =>
          console.error(`[ ${schema} ] FAILED MIGRATING SCHEMA :(`, error),
        );
    }
    return promisify(exec)(
      `DATABASE_URL=${`${process.env.DATABASE_URL}?schema=${schema}`} npx prisma migrate deploy`,
    )
      .then(() => console.log(`[ ${schema} ] SUCCESSFULLY MIGRATED SCHEMA`))
      .catch((error) =>
        console.error(`[ ${schema} ] FAILED MIGRATING SCHEMA :(`, error),
      );
  };

  return {
    getClient,
    disconnectAll,
    createTenantSchema,
    destroyTenantSchema,
    rootPrismaClient,
    devPush,
    prodMigrate,
  };
};

export const prismaManager = createMultitenantPrismaManager();
export type PrismaManager = ReturnType<typeof createMultitenantPrismaManager>;
export type PrismaTX = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
