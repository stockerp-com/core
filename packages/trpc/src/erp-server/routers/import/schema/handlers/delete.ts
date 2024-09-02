import { deleteImportSchemaSchema } from '@core/validation/erp/import/schema/delete.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const deleteHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(deleteImportSchemaSchema)
  .mutation(async ({ ctx, input }) => {
    const orgId = ctx.session?.currentOrganization?.id;
    if (!orgId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: ctx.t?.('errors:http.403'),
      });
    }

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
    if (importSchema.organizationId !== ctx.session?.currentOrganization?.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: ctx.t?.('res:import.schema.delete.forbidden'),
      });
    }

    ctx.prismaManager?.rootPrismaClient?.importSchema.delete({
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
