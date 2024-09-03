import { editImportSchemaSchema } from '@core/validation/erp/import/schema/edit.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';
import { trackArrayObjectsChanges } from '@core/utils/array';

export const editHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(editImportSchemaSchema)
  .mutation(async ({ ctx, input }) => {
    const importSchema =
      await ctx.prismaManager?.rootPrismaClient.importSchema.findUnique({
        where: {
          id: input.id,
        },
        include: {
          additionalIdentificators: true,
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

    const oldAddIdArray = importSchema.additionalIdentificators
      ? importSchema.additionalIdentificators
          .sort((a, b) => (a.index > b.index ? 1 : -1))
          .map(({ identificatorName }) => ({
            identificatorName,
          }))
      : [];
    const newAddIdArray = input.additionalIdentificators || [];

    const { newData, deletedData, updatedData } = trackArrayObjectsChanges(
      oldAddIdArray,
      newAddIdArray,
      ['identificatorName'],
      true,
    );

    await ctx.tenantDb?.importSchema.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        schema: input.schema,
        additionalIdentificators: {
          createMany:
            newData && newData.length > 0
              ? {
                  data: newData.map(({ item }, index) => ({
                    identificatorName: item.identificatorName,
                    index,
                  })),
                }
              : undefined,
          update:
            updatedData && updatedData.length > 0
              ? updatedData.map(({ item, newIndex }) => ({
                  where: {
                    schemaId_identificatorName: {
                      identificatorName: item.identificatorName,
                      schemaId: input.id,
                    },
                  },
                  data: {
                    index: newIndex,
                  },
                }))
              : undefined,
          deleteMany:
            deletedData && deletedData.length > 0
              ? {
                  schemaId: input.id,
                  identificatorName: {
                    in: deletedData.map(
                      ({ identificatorName }) => identificatorName,
                    ),
                  },
                }
              : undefined,
        },
      },
    });

    return {
      message: ctx.t?.('res:import.schema.edit.success', {
        name: input.name,
      }),
    };
  });
