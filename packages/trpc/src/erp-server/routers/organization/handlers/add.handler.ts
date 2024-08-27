import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '../../../procedures/authenticated.js';
import { addOrganizationSchema } from '@retailify/validation/erp/organization/add.schema';
import { generateSession } from '../../../utils/session.js';

export const addHandler = authenticatedProcedure
  .input(addOrganizationSchema)
  .mutation(async ({ ctx, input }) => {
    const organization =
      await ctx.prismaManager?.rootPrismaClient.organization.create({
        data: {
          name: input.name,
          description: input.description,
          staff: {
            create: {
              employeeId: ctx.session!.id,
              role: ['OWNER'],
            },
          },
        },
      });

    const orgId = organization?.id;

    if (!orgId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: ctx.t?.('res:organization.add.failed'),
      });
    }

    await ctx.prismaManager?.createTenantSchema(orgId);
    if (process.env.NODE_ENV === 'production') {
      await ctx.prismaManager?.prodMigrate(
        `tenant_${orgId}`,
        '../../packages/db/prisma/schema',
      );
    } else {
      await ctx.prismaManager?.devPush(
        `tenant_${orgId}`,
        '../../packages/db/prisma/schema',
      );
    }

    const { accessToken } = await generateSession(ctx, {
      id: ctx.session.id!,
      currentOrganization: {
        id: orgId,
        role: ['OWNER'],
      },
    });

    return {
      message: ctx.t?.('res:organization.add.success', {
        name: organization?.name,
      }),
      accessToken,
    };
  });
