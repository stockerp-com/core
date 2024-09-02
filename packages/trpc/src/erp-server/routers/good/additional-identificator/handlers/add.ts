import { addAdditionalGoodIdentificatorSchema } from '@core/validation/erp/good/additional-identificator/add.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const addHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(addAdditionalGoodIdentificatorSchema)
  .mutation(async ({ ctx, input }) => {
    const existingAdditionalIdentificator =
      await ctx.tenantDb?.additionalGoodIdentificator.findUnique({
        where: {
          name: input.name,
        },
      });
    if (existingAdditionalIdentificator) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: ctx.t?.('res:good.additional_identificator.add.name_taken', {
          name: input.name,
        }),
      });
    }

    await ctx.tenantDb?.additionalGoodIdentificator.create({
      data: {
        name: input.name,
      },
    });

    return {
      message: ctx.t?.('res:good.additional_identificator.add.success', {
        name: input.name,
      }),
    };
  });
