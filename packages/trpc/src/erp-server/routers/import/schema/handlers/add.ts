import { addImportSchemaSchema } from '@core/validation/erp/import/schema/add.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const addHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(addImportSchemaSchema)
  .mutation(async ({ ctx, input }) => {
    const orgId = ctx.session?.currentOrganization?.id;
    if (!orgId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: ctx.t?.('errors:http.403'),
      });
    }

    const existingImportSchema =
      await ctx.prismaManager?.rootPrismaClient.importSchema.findUnique({
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

    const schemaFile = await ctx.prismaManager?.rootPrismaClient.file.create({
      data: input.file,
    });

    await ctx.prismaManager?.rootPrismaClient.importSchema.create({
      data: {
        name: input.name,
        organizationId: orgId,
        fileId: schemaFile?.id,
        isPublic: input.isPublic,
      },
    });

    return {
      message: ctx.t?.('res:import.schema.add.success', {
        name: input.name,
      }),
    };
  });
