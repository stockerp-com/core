import { findManyInfiniteStockpointsSchema } from '@core/validation/erp/stockpoint/find-many.schema';
import { tenantProcedure } from '../../../procedures/tenant.js';

export const findManyInfiniteHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(findManyInfiniteStockpointsSchema)
  .query(async ({ ctx, input }) => {
    const items = await ctx.tenantDb?.stockpoint.findMany({
      take: input.limit + 1,
      where: {
        name: { search: input.search },
        isArchived: input.isArchived,
      },
      select: {
        id: true,
        name: true,
      },
      cursor: input.cursor ? { id: input.cursor } : undefined,
      orderBy: { id: 'asc' },
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
