import { editOrganizationSchema } from '@retailify/validation/erp/organization/edit.schema';
import { authenticatedProcedure } from '../../../procedures/authenticated.js';
import { TRPCError } from '@trpc/server';

export const editHandler = authenticatedProcedure
  .input(editOrganizationSchema)
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
        message: ctx.t?.('res:organization.edit.notFound', {
          id: input.id,
        }),
      });
    }
    const staffIds = organization.staff.map((staff) => staff.employeeId);
    if (!staffIds.includes(ctx.session!.id)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: ctx.t?.('res:organization.edit.forbidden'),
      });
    }
    const userRole = organization.staff.find(
      (staff) => staff.employeeId === ctx.session!.id,
    )?.role;
    if (!userRole?.includes('OWNER') && !userRole?.includes('ADMIN')) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: ctx.t?.('res:organization.edit.forbidden'),
      });
    }

    await ctx.prismaManager?.rootPrismaClient.organization.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.name,
        description: input.description,
      },
    });

    return {
      message: ctx.t?.('res:organization.edit.success', {
        name: input.name,
      }),
    };
  });
