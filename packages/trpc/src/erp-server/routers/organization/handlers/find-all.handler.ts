import { authenticatedProcedure } from '../../../procedures/authenticated.js';
import { findAllInfiniteSchema } from '@retailify/validation/erp/organization/find-all.schema';

export const findAllInfiniteHandler = authenticatedProcedure
  .input(findAllInfiniteSchema)
  .query(async ({ ctx, input }) => {
    const items =
      await ctx.prismaManager?.rootPrismaClient.organization.findMany({
        take: input.limit + 1,
        where: {
          name: { search: input.search },
          staff: {
            some: {
              employeeId: { equals: ctx.session!.id },
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
