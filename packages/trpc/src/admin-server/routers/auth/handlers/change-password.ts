import { changePasswordSchema } from '@retailify/validation/admin/auth/change-password.schema';
import { adminProcedure } from '../../../procedures/admin.js';
import { TRPCError } from '@trpc/server';
import { hash } from 'bcrypt';

export const changePasswordHandler = adminProcedure
  .input(changePasswordSchema)
  .mutation(async ({ ctx, input }) => {
    const employee = await ctx.db?.employee.findUnique({
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

    await ctx.db?.employee.update({
      where: {
        id: ctx.session?.id,
      },
      data: {
        pwHash: await hash(input.newPassword, 10),
      },
    });

    return {
      message: ctx.t?.('res:auth.change_password.success'),
    };
  });
