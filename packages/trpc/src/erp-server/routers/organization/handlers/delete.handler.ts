import { deleteOrganizationSchema } from '@retailify/validation/erp/organization/delete.schema';
import { authenticatedProcedure } from '../../../procedures/authenticated.js';
import { TRPCError } from '@trpc/server';

export const deleteHandler = authenticatedProcedure
  .input(deleteOrganizationSchema)
  .mutation(async ({ ctx, input }) => {
    const organization =
      await ctx.prismaManager?.rootPrismaClient.organization.findUnique({
        where: {
          id: input.id,
        },
        select: {
          staff: {
            where: {
              employeeId: ctx.session!.id,
            },
          },
        },
      });

    if (!organization) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:organization.delete.notFound', {
          id: input.id,
        }),
      });
    }
    const staffIds = organization.staff.map((staff) => staff.employeeId);
    if (!staffIds.includes(ctx.session!.id)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: ctx.t?.('res:organization.delete.forbidden'),
      });
    }
    const userRole = organization.staff.find(
      (staff) => staff.employeeId === ctx.session!.id,
    )?.role;
    if (!userRole?.includes('OWNER')) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: ctx.t?.('res:organization.delete.forbidden'),
      });
    }

    await Promise.all([
      ctx.prismaManager?.rootPrismaClient.organization.delete({
        where: {
          id: input.id,
        },
      }),
      ctx.prismaManager?.destroyTenantSchema(input.id),
    ]);

    return {
      message: ctx.t?.('res:organization.delete.success', {
        id: input.id,
      }),
    };
  });
