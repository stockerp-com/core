import { authenticatedProcedure } from '../../../procedures/authenticated.js';
import {
  findManyInfiniteOrganizationsSchema,
  findManyOrganizationsSchema,
} from '@retailify/validation/erp/organization/find-many.schema';

export const findManyInfiniteHandler = authenticatedProcedure
  .input(findManyInfiniteOrganizationsSchema)
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

export const findManyHandler = authenticatedProcedure
  .input(findManyOrganizationsSchema)
  .query(async ({ ctx, input }) => {
    const items =
      await ctx.prismaManager?.rootPrismaClient.organization.findMany({
        include: {
          _count: {
            select: {
              staff: true,
            },
          },
        },
        where: {
          name: { search: input.search },
          staff: {
            some: {
              employeeId: { equals: ctx.session!.id },
            },
          },
        },
        orderBy: input.orderBy,
      });

    return {
      items,
    };
  });
