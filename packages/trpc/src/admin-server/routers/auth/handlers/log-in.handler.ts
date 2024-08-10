import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../procedures/public.js';
import { compare } from 'bcrypt';
import { processSession } from '../../../utils/session.js';
import { logInSchema } from '@retailify/validation/admin/auth/log-in.schema';

export const logInHandler = publicProcedure
  .input(logInSchema)
  .mutation(async ({ ctx, input }) => {
    const employee = await ctx.db?.employee.findUnique({
      where: {
        email: input.email,
      },
    });
    if (!employee) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Employee not found',
      });
    }

    const validPassword = await compare(input.password, employee.pwHash);
    if (!validPassword) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid password',
      });
    }

    await processSession(ctx, {
      id: employee.id,
    });

    return {
      message: 'Successfully logged in',
    };
  });
