import { deleteAttributeSchema } from '@core/validation/erp/good/attribute/delete.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const deleteHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(deleteAttributeSchema)
  .mutation(async ({ ctx, input }) => {
    const attribute = await ctx.tenantDb?.attribute.findUnique({
      where: {
        id: input.id,
      },
    });
    if (!attribute) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:good.attribute.delete.not_found', {
          id: input.id,
        }),
      });
    }

    await ctx.tenantDb?.attribute.delete({
      where: {
        id: input.id,
      },
    });

    return {
      message: ctx.t?.('res:good.attribute.delete.success', {
        id: input.id,
      }),
    };
  });
