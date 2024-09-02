import { deleteAdditionalGoodIdentificatorSchema } from '@core/validation/erp/good/additional-identificator/delete.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const deleteHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(deleteAdditionalGoodIdentificatorSchema)
  .mutation(async ({ ctx, input }) => {
    const additionalIdentificator =
      await ctx.tenantDb?.additionalGoodIdentificator.findUnique({
        where: {
          name: input.name,
        },
      });
    if (!additionalIdentificator) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: ctx.t?.('res:good.additional_identificator.delete.not_found', {
          name: input.name,
        }),
      });
    }

    await ctx.tenantDb?.additionalGoodIdentificator.delete({
      where: {
        name: input.name,
      },
    });

    return {
      message: ctx.t?.('res:good.additional_identificator.delete.success', {
        name: input.name,
      }),
    };
  });
