import { publicProcedure } from '../../../procedures/public.js';
import { hash } from 'bcrypt';
import { processSession } from '../../../utils/session.js';
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
        message: 'Email already in use',
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
        message: 'Failed to create user',
      });
    }

    await processSession(ctx, {
      id: employee.id,
    });

    return {
      message: 'Successfully signed up',
    };
  });
