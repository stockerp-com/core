import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../procedures/public.js';
import { compare } from 'bcrypt';
import { processSession } from '../../../utils/session.js';
import { signInSchema } from '@retailify/validation/admin/auth/sign-in.schema';

export const signInHandler = publicProcedure
  .input(signInSchema)
  .mutation(async ({ ctx, input }) => {
    const employee = await ctx.db?.employee.findUnique({
      where: {
        email: input.email,
      },
    });
    if (!employee) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: ctx.t?.('res:auth.sign_in.invalid_credentials'),
      });
    }

    const validPassword = await compare(input.password, employee.pwHash);
    if (!validPassword) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: ctx.t?.('res:auth.sign_in.invalid_credentials'),
      });
    }

    await processSession(ctx, {
      id: employee.id,
    });

    return {
      message: ctx.t?.('res:auth.sign_in.success', {
        email: input.email,
      }),
    };
  });
