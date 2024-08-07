import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../procedures/public.js';
import { logInSchema } from '@retailify/validation';
import { compare } from 'bcrypt';
import { processSession } from '../../../utils/session.js';

export const logInHandler = publicProcedure
  .input(logInSchema)
  .mutation(async ({ ctx, input }) => {
    const admin = await ctx.db?.admin.findUnique({
      where: {
        email: input.email,
      },
    });
    if (!admin) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Admin not found',
      });
    }

    const validPassword = await compare(input.password, admin.pwHash);
    if (!validPassword) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid password',
      });
    }

    await processSession(ctx, {
      id: admin.id,
    });

    return {
      message: 'Successfully logged in',
    };
  });
