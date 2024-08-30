import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '../../../procedures/authenticated.js';
import { addOrganizationSchema } from '@core/validation/erp/organization/add.schema';
import { generateSession } from '../../../utils/session.js';
import logger from '@core/logger';
import { observable } from '@trpc/server/observable';

export const addHandler = authenticatedProcedure
  .input(addOrganizationSchema)
  .mutation(async ({ ctx, input }) => {
    ctx.redis?.emit('erp:organization:add_progress', { progress: 0 });
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
    ctx.redis?.emit('erp:organization:add_progress', { progress: 0.25 });

    const orgId = organization?.id;

    if (!orgId) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: ctx.t?.('res:organization.add.failed'),
      });
    }

    await ctx.prismaManager?.createTenantSchema(orgId);
    ctx.redis?.emit('erp:organization:add_progress', { progress: 0.5 });
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
    ctx.redis?.emit('erp:organization:add_progress', { progress: 0.75 });

    const { accessToken } = await generateSession(ctx, {
      id: ctx.session.id!,
      currentOrganization: {
        id: orgId,
        role: ['OWNER'],
      },
    });
    ctx.redis?.emit('erp:organization:add_progress', { progress: 1 });

    logger.info({ organizationId: orgId }, 'Organization added');
    return {
      message: ctx.t?.('res:organization.add.success', {
        name: organization?.name,
      }),
      accessToken,
    };
  });

type OnAddData = {
  progress: number;
};

export const onAddHandler = authenticatedProcedure.subscription(({ ctx }) =>
  observable<OnAddData>((emit) => {
    const onAdd = (data: OnAddData) => {
      emit.next(data);
    };

    ctx.redis?.on('erp:organization:add_progress', onAdd);

    return () => {
      ctx.redis?.off('erp:organization:add_progress', onAdd);
    };
  }),
);
