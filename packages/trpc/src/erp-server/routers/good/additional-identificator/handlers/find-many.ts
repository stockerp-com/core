import { findManyInfiniteAdditionalGoodIdentificatorsSchema } from '@core/validation/erp/good/additional-identificator/find-many.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';

export const findManyInfiniteHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(findManyInfiniteAdditionalGoodIdentificatorsSchema)
  .query(async ({ ctx, input }) => {
    const items = await ctx.tenantDb?.additionalGoodIdentificator.findMany({
      take: input.limit + 1,
      where: {
        name: {
          search: input.search,
        },
      },
      select: {
        name: true,
      },
      cursor: input.cursor ? { name: input.cursor } : undefined,
      orderBy: input.orderBy,
    });

    let nextCursor: string | undefined = undefined;
    if (items && items.length > input.limit) {
      const nextItem = items?.pop();
      nextCursor = nextItem!.name;
    }

    return {
      items,
      nextCursor,
    };
  });
