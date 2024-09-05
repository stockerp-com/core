import { editAttributeValueSchema } from '@core/validation/erp/good/attribute/value/edit.schema';
import { tenantProcedure } from '../../../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const editHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(editAttributeValueSchema)
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

    await ctx.tenantDb?.attributeValue.update({
      where: {
        id: input.id,
      },
      data: {
        localizations: {
          upsert: {
            where: {
              valueId_locale: {
                valueId: input.id,
                locale: input.locale,
              },
            },
            update: {
              data: input.data,
            },
            create: {
              data: input.data,
              locale: input.locale,
            },
          },
        },
      },
    });

    return {
      message: ctx.t?.('res:good.attribute.value.edit.success', {
        value: input.data,
      }),
    };
  });
