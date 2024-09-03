import { deleteImportSchemaSchema } from '@core/validation/erp/import/schema/delete.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const deleteHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(deleteImportSchemaSchema)
  .mutation(async ({ ctx, input }) => {
    const importSchema =
      await ctx.prismaManager?.rootPrismaClient.importSchema.findUnique({
        where: {
          id: input.id,
        },
      });
    if (!importSchema) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:import.schema.delete.not_found', {
          id: input.id,
        }),
      });
    }

    ctx.tenantDb?.importSchema.delete({
      where: {
        id: input.id,
      },
    });

    return {
      message: ctx.t?.('res:import.schema.delete.success', {
        name: importSchema.name,
      }),
    };
  });
