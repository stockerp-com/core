import {
  findManyImportSchemasSchema,
  findManyInfiniteImportSchemasSchema,
} from '@core/validation/erp/import/schema/find-many.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';

export const findManyHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(findManyImportSchemasSchema)
  .query(async ({ ctx, input }) => {
    const items = await ctx.tenantDb?.importSchema.findMany({
      where: {
        name: {
          search: input.search,
        },
      },
      orderBy: input.orderBy,
    });

    return items;
  });

export const findManyInfiniteHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(findManyInfiniteImportSchemasSchema)
  .query(async ({ ctx, input }) => {
    const items = await ctx.tenantDb?.importSchema.findMany({
      take: input.limit + 1,
      where: {
        name: {
          search: input.search,
        },
      },
      select: {
        id: true,
        name: true,
      },
      cursor: input.cursor ? { id: input.cursor } : undefined,
      orderBy: input.orderBy,
    });

    let nextCursor: number | undefined = undefined;
    if (items && items.length > input.limit) {
      const nextItem = items?.pop();
      nextCursor = nextItem!.id;
    }

    return {
      items,
      nextCursor,
    };
  });
