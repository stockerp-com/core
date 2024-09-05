import { findManyInfiniteAttributeSchema } from '@core/validation/erp/good/attribute/find-many.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';

export const findManyInfiniteHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(findManyInfiniteAttributeSchema)
  .query(async ({ ctx, input }) => {
    const items = await ctx.tenantDb?.attribute.findMany({
      take: input.limit + 1,
      where: {
        localizations: {
          some: {
            name: { search: input.search },
          },
        },
      },
      select: {
        id: true,
        localizations: {
          where: {
            locale: input.locale,
          },
          select: {
            name: true,
          },
        },
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
