import { addStockpointSchema } from '@core/validation/erp/stockpoint/add.schema';
import { tenantProcedure } from '../../../procedures/tenant.js';

export const addHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(addStockpointSchema)
  .mutation(async ({ ctx, input }) => {
    const stockpoint = await ctx.tenantDb?.stockpoint.create({
      data: input,
    });

    return {
      message: ctx.t?.('res:stockpoint.add.success', {
        name: stockpoint?.name,
      }),
    };
  });
