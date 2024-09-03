import { addImportSchema } from '@core/validation/erp/import/add.schema';
import { tenantProcedure } from '../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const addHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(addImportSchema)
  .mutation(async ({ ctx, input }) => {
    const [importFile, importSchema] = await Promise.all([
      ctx.tenantDb?.file.findUnique({
        where: {
          key: input.importFileKey,
        },
      }),
      ctx.tenantDb?.importSchema.findUnique({
        where: {
          id: input.schemaId,
        },
      }),
    ]);
    if (!importFile) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:import.add.import_file_not_found'),
      });
    }
    if (!importSchema) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:import.add.import_schema_not_found'),
      });
    }
  });
