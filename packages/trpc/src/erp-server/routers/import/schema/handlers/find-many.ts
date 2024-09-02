import {
  findManyImportSchemasSchema,
  findManyInfiniteImportSchemasSchema,
} from '@core/validation/erp/import/schema/find-many.schema';
import { tenantProcedure } from '../../../../procedures/tenant.js';
import { TRPCError } from '@trpc/server';

export const findManyHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(findManyImportSchemasSchema)
  .query(async ({ ctx, input }) => {
    const orgId = ctx.session?.currentOrganization?.id;
    if (!orgId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: ctx.t?.('errors:http.403'),
      });
    }

    const items =
      await ctx.prismaManager?.rootPrismaClient.importSchema.findMany({
        where: {
          OR: [{ isPublic: true }, { isPublic: false, organizationId: orgId }],
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
    const orgId = ctx.session?.currentOrganization?.id;
    if (!orgId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: ctx.t?.('errors:http.403'),
      });
    }

    const items =
      await ctx.prismaManager?.rootPrismaClient.importSchema.findMany({
        take: input.limit + 1,
        where: {
          OR: [{ isPublic: true }, { isPublic: false, organizationId: orgId }],
          name: {
            search: input.search,
          },
        },
        select: {
          id: true,
          name: true,
          isPublic: true,
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
