import { addImportSchemaSchema } from '@core/validation/erp/import/schema/add.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const addHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(addImportSchemaSchema)
  .mutation(async ({ ctx, input }) => {
    const existingImportSchema = await ctx.tenantDb?.importSchema.findUnique({
      where: {
        name: input.name,
      },
    });
    if (existingImportSchema) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: ctx.t?.('res:import.schema.add.name_taken', {
          name: input.name,
        }),
      });
    }

    await ctx.tenantDb?.importSchema.create({
      data: {
        name: input.name,
        schema: input.schema,
        additionalIdentificators:
          input.additionalIdentificators &&
          input.additionalIdentificators.length > 0
            ? {
                createMany: {
                  data: input.additionalIdentificators?.map(
                    ({ identificatorName }, index) => ({
                      identificatorName,
                      index,
                    }),
                  ),
                },
              }
            : undefined,
      },
    });

    return {
      message: ctx.t?.('res:import.schema.add.success', {
        name: input.name,
      }),
    };
  });
