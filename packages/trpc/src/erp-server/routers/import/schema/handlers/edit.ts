import { editImportSchemaSchema } from '@core/validation/erp/import/schema/edit.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const editHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(editImportSchemaSchema)
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
        message: ctx.t?.('res:import.schema.edit.not_found', {
          id: input.id,
        }),
      });
    }
    if (importSchema.organizationId !== ctx.session?.currentOrganization?.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: ctx.t?.('res:import.schema.edit.forbidden'),
      });
    }

    await ctx.prismaManager?.rootPrismaClient.importSchema.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        schema: input.schema,
      },
    });

    return {
      message: ctx.t?.('res:import.schema.edit.success', {
        name: input.name,
      }),
    };
  });
