import { findOneAttributeSchema } from '@core/validation/erp/good/attribute/find-one.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const findOneHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(findOneAttributeSchema)
  .query(async ({ ctx, input }) => {
    const attribute = await ctx.tenantDb?.attribute.findUnique({
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
    if (!attribute) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:good.attribute.find_one.not_found', {
          id: input.id,
        }),
      });
    }

    return {
      message: ctx.t?.('res:good.attribute.find_one.success', {
        id: input.id,
      }),
      attribute,
    };
  });
