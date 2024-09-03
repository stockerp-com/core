import { findOneImportSchemaSchema } from '@core/validation/erp/import/schema/find-one.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const findOneHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(findOneImportSchemaSchema)
  .query(async ({ ctx, input }) => {
    const importSchema = await ctx.tenantDb?.importSchema.findUnique({
      where: {
        id: input.id,
      },
    });
    if (!importSchema) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:import.schema.find_one.not_found', {
          id: input.id,
        }),
      });
    }

    return importSchema;
  });
