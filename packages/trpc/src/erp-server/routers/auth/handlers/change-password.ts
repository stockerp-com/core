import { changePasswordSchema } from '@core/validation/erp/auth/change-password.schema';
import { authenticatedProcedure } from '../../../procedures/authenticated.js';
import { TRPCError } from '@trpc/server';
import { hash } from 'bcrypt';
import logger from '@core/logger';

export const changePasswordHandler = authenticatedProcedure
  .input(changePasswordSchema)
  .mutation(async ({ ctx, input }) => {
    const employee =
      await ctx.prismaManager?.rootPrismaClient.employee.findUnique({
        where: {
          id: ctx.session?.id,
        },
      });
    if (!employee) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:auth.change_password.failed'),
      });
    }

    await ctx.prismaManager?.rootPrismaClient.employee.update({
      where: {
        id: ctx.session?.id,
      },
      data: {
        pwHash: await hash(input.newPassword, 10),
      },
    });

    logger.info({ employeeId: ctx.session?.id }, 'Changed password');
    return {
      message: ctx.t?.('res:auth.change_password.success'),
    };
  });
