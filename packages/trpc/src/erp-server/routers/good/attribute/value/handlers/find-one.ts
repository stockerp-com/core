import { findOneAttributeValueSchema } from '@core/validation/erp/good/attribute/value/find-one.schema';
import { tenantProcedure } from '../../../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const findOneHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(findOneAttributeValueSchema)
  .query(async ({ ctx, input }) => {
    const attributeValue = await ctx.tenantDb?.attributeValue.findUnique({
      where: {
        id: input.id,
      },
      include: {
        localizations: {
          where: {
            languageName: input.languageName,
          },
        },
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

    return {
      message: ctx.t?.('res:good.attribute.value.find_one.success', {
        id: input.id,
      }),
      attributeValue,
    };
  });
