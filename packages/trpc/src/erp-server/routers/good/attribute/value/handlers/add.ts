import { addAttributeValueSchema } from '@core/validation/erp/good/attribute/value/add.schema';
import { tenantProcedure } from '../../../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const addHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(addAttributeValueSchema)
  .mutation(async ({ ctx, input }) => {
    const attribute = await ctx.tenantDb?.attribute.findUnique({
      where: {
        id: input.attributeId,
      },
    });
    if (!attribute) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:good.attribute.find_one.not_found', {
          id: input.attributeId,
        }),
      });
    }

    await ctx.tenantDb?.attributeValue.create({
      data: {
        attributeId: input.attributeId,
        localizations: {
          create: {
            data: input.data,
            locale: input.locale,
          },
        },
      },
    });

    return {
      message: ctx.t?.('res:good.attribute.value.add.success', {
        value: input.data,
      }),
    };
  });
