import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '../../../procedures/authenticated.js';
import { useSchema } from '@retailify/validation/admin/organization/use.schema';
import { setSession } from '../../../utils/session.js';

export const useHandler = authenticatedProcedure
  .input(useSchema)
  .mutation(async ({ ctx, input }) => {
    const organization = await ctx.db?.organization.findUnique({
      where: {
        id: input.organizationId,
      },
    });
    if (!organization) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:organization.not_found', {
          id: input.organizationId,
        }),
      });
    }

    const member = await ctx.db?.employeeToOrganization.findUnique({
      where: {
        organizationId_employeeId: {
          organizationId: input.organizationId,
          employeeId: ctx.session!.id,
        },
      },
    });
    if (!member) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: ctx.t?.('res:organization.use.not_member', {
          name: organization.name,
        }),
      });
    }

    await setSession(ctx, {
      id: ctx.session!.id,
      organizationId: input.organizationId,
      role: member.role,
    });

    return {
      message: ctx.t?.('res:organization.use.success', {
        name: organization.name,
      }),
    };
  });
