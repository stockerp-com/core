import { publicProcedure } from '../../../procedures/public.js';
import { hash } from 'bcrypt';
import { setSession } from '../../../utils/session.js';
import { TRPCError } from '@trpc/server';
import { signUpSchema } from '@retailify/validation/admin/auth/sign-up.schema';

export const signUpHandler = publicProcedure
  .input(signUpSchema)
  .mutation(async ({ ctx, input }) => {
    const existingUser = await ctx.db?.employee.findUnique({
      where: {
        email: input.email,
      },
    });

    if (existingUser) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: ctx.t?.('res:auth.sign_up.email_taken', {
          email: input.email,
        }),
      });
    }

    const employee = await ctx.db?.employee.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        pwHash: await hash(input.password, 10),
        preferredLanguage: input.preferredLanguage,
      },
    });

    if (!employee) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: ctx.t?.('res:auth.sign_up.failed'),
      });
    }

    await setSession(ctx, {
      id: employee.id,
    });

    return {
      message: ctx.t?.('res:auth.sign_up.success', {
        email: input.email,
      }),
    };
  });
