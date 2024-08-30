import { restorePasswordSendOtpSchema } from '@core/validation/erp/auth/reset-password.schema';
import { procedure } from '../../../../trpc.js';
import { TRPCError } from '@trpc/server';

export const sendOtpHandler = procedure
  .input(restorePasswordSendOtpSchema)
  .mutation(async ({ ctx, input }) => {
    const employee =
      await ctx.prismaManager?.rootPrismaClient.employee.findUnique({
        where: {
          email: input.email,
        },
      });

    if (!employee) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: ctx.t?.('res:auth.reset_password.email_not_found', {
          email: input.email,
        }),
      });
    }

    // Send OTP to email
    // await sendOtpToEmail(input.email);
  });
