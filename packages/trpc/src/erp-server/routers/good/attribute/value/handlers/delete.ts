import { TRPCError } from '@trpc/server';
import { tenantProcedure } from '../../../../../procedures/tenant.js';
import { deleteAttributeValueSchema } from '@core/validation/erp/good/attribute/value/delete.schema';

export const deleteHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(deleteAttributeValueSchema)
  .mutation(async ({ ctx, input }) => {
    const attributeValue = await ctx.tenantDb?.attributeValue.findUnique({
      where: {
        id: input.id,
      },
    });
    if (!attributeValue) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:good.attribute.value.find_one.not_found', {
          id: input.id,
        }),
      });
    }

    await ctx.tenantDb?.attributeValue.delete({
      where: {
        id: input.id,
      },
    });

    return {
      message: ctx.t?.('res:good.attribute.value.delete.success', {
        id: input.id,
      }),
    };
  });
