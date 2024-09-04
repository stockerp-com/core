import { findOneStockpointSchema } from '@core/validation/erp/stockpoint/find-one.schema';
import { tenantProcedure } from '../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const findOneHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(findOneStockpointSchema)
  .query(async ({ ctx, input }) => {
    const stockpoint = await ctx.tenantDb?.stockpoint.findUnique({
      where: {
        id: input.id,
      },
    });
    if (!stockpoint) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:stockpoint.find_one.not_found', {
          id: input.id,
        }),
      });
    }

    return {
      message: ctx.t?.('res:stockpoint.find_one.success', {
        name: stockpoint.name,
      }),
      stockpoint,
    };
  });
