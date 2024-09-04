import { archiveStockpointSchema } from '@core/validation/erp/stockpoint/archive.schema';
import { tenantProcedure } from '../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const archiveHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(archiveStockpointSchema)
  .mutation(async ({ ctx, input }) => {
    const stockpoint = await ctx.tenantDb?.stockpoint.findUnique({
      where: {
        id: input.id,
      },
    });
    if (!stockpoint) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:stockpoint.archive.not_found', {
          id: input.id,
        }),
      });
    }

    await ctx.tenantDb?.stockpoint.update({
      where: {
        id: input.id,
      },
      data: {
        archivedAt: new Date(),
        isArchived: true,
      },
    });

    return {
      message: ctx.t?.('res:stockpoint.archive.success', {
        name: stockpoint.name,
      }),
    };
  });
