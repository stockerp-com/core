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
          upsert: input.localizations.map(({ locale, data }) => ({
            where: {
              valueId_locale: {
                valueId: input.id,
                locale,
              },
            },
            create: {
              data,
              localization: {
                connectOrCreate: {
                  where: {
                    locale,
                  },
                  create: {
                    locale,
                  },
                },
              },
            },
            update: {
              data,
            },
          })),
        },
      },
    });

    return {
      message: ctx.t?.('res:good.attribute.value.edit.success', {
        value: input.localizations[0]?.data,
      }),
    };
  });
