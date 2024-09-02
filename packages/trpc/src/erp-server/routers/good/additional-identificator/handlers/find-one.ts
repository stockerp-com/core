import { findOneAdditionalGoodIdentificatorSchema } from '@core/validation/erp/good/additional-identificator/find-one.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const findOneHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(findOneAdditionalGoodIdentificatorSchema)
  .query(async ({ ctx, input }) => {
    const additionalIdentificator =
      await ctx.tenantDb?.additionalGoodIdentificator.findUnique({
        where: {
          name: input.name,
        },
      });
    if (!additionalIdentificator) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.(
          'res:good.additional_identificator.find_one.not_found',
          {
            name: input.name,
          },
        ),
      });
    }

    return {
      message: ctx.t?.('res:good.additional_identificator.find_one.success', {
        name: input.name,
      }),
      additionalIdentificator,
    };
  });
