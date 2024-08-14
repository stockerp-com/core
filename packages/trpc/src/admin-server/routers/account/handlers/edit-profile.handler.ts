import { editProfileSchema } from '@retailify/validation/admin/account/edit-profile.schema';
import { adminProcedure } from '../../../procedures/admin.js';
import { TRPCError } from '@trpc/server';

export const editProfileHandler = adminProcedure
  .input(editProfileSchema)
  .mutation(async ({ ctx, input }) => {
    const employee = await ctx.db?.employee.findUnique({
      where: {
        id: ctx.session?.id,
      },
    });
    if (!employee) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:account.edit_profile.failed'),
      });
    }

    if (input.email !== employee.email) {
      const existingEmployee = await ctx.db?.employee.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existingEmployee) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: ctx.t?.('res:account.edit_profile.email_taken', {
            email: input.email,
          }),
        });
      }
    }

    await ctx.db?.employee.update({
      where: {
        id: ctx.session?.id,
      },
      data: {
        fullName: input.fullName,
        email: input.email,
        pictureKey: input.pictureKey,
      },
    });

    return {
      message: ctx.t?.('res:account.edit_profile.success'),
    };
  });
