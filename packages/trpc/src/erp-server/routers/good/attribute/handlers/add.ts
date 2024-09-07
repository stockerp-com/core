import { addAttributeSchema } from '@core/validation/erp/good/attribute/add.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';

export const addHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(addAttributeSchema)
  .mutation(async ({ ctx, input }) => {
    await ctx.tenantDb?.attribute.create({
      data: {
        localizations: {
          create: input.localizations.map(({ locale, name }) => ({
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
          })),
        },
      },
    });

    return {
      message: ctx.t?.('res:good.attribute.add.success', {
        name: input.localizations[0]?.name,
      }),
    };
  });
