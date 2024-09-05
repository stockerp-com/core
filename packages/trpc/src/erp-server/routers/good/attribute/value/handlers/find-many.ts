import { findManyInfiniteAttributeValueSchema } from '@core/validation/erp/good/attribute/value/find-many.schema';
import { tenantProcedure } from '../../../../../procedures/tenant.js';

export const findManyInfiniteHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(findManyInfiniteAttributeValueSchema)
  .query(async ({ ctx, input }) => {
    const items = await ctx.tenantDb?.attributeValue.findMany({
      take: input.limit + 1,
      where: {
        localizations: {
          some: {
            data: { search: input.search },
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
            data: true,
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
