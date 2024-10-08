import { editAttributeSchema } from '@core/validation/erp/good/attribute/edit.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const editHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(editAttributeSchema)
  .mutation(async ({ ctx, input }) => {
    const attribute = await ctx.tenantDb?.attribute.findUnique({
      where: {
        id: input.id,
      },
    });
    if (!attribute) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:good.attribute.edit.not_found', {
          id: input.id,
        }),
      });
    }

    await ctx.tenantDb?.attribute.update({
      where: {
        id: input.id,
      },
      data: {
        localizations: {
          upsert: input.localizations.map(({ locale, name }) => ({
            where: {
              attributeId_locale: {
                attributeId: input.id,
                locale,
              },
            },
            create: {
              name,
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
              name,
            },
          })),
        },
      },
    });

    return {
      message: ctx.t?.('res:good.attribute.edit.success', {
        name: input.localizations[0]?.name,
      }),
    };
  });
