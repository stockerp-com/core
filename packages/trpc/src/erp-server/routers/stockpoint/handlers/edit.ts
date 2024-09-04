import { editStockpointSchema } from '@core/validation/erp/stockpoint/edit.schema';
import { tenantProcedure } from '../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const editHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(editStockpointSchema)
  .mutation(async ({ ctx, input }) => {
    const stockpoint = await ctx.tenantDb?.stockpoint.findUnique({
      where: {
        id: input.id,
      },
    });
    if (!stockpoint) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:stockpoint.edit.not_found', {
          id: input.id,
        }),
      });
    }

    await ctx.tenantDb?.stockpoint.update({
      where: {
        id: input.id,
      },
      data: input,
    });

    return {
      message: ctx.t?.('res:stockpoint.edit.success', {
        name: stockpoint.name,
      }),
    };
  });
