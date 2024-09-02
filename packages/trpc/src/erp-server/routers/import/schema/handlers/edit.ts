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
        include: {
          file: true,
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

    if (importSchema.file?.key !== input.file.key) {
      await Promise.all([
        ctx.prismaManager?.rootPrismaClient.file.update({
          where: {
            id: importSchema.file?.id,
          },
          data: {
            key: input.file.key,
            name: input.file.name,
            size: input.file.size,
            type: input.file.type,
          },
        }),
        ctx.aws?.s3.deleteObject({
          key: importSchema.file?.key ?? '',
        }),
      ]);
    }

    await ctx.prismaManager?.rootPrismaClient.importSchema.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
      },
    });

    return {
      message: ctx.t?.('res:import.schema.edit.success', {
        name: input.name,
      }),
    };
  });
