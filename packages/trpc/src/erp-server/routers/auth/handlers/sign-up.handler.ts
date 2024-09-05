import { publicProcedure } from '../../../procedures/public.js';
import { hash } from 'bcrypt';
import { TRPCError } from '@trpc/server';
import { signUpSchema } from '@core/validation/erp/auth/sign-up.schema';
import { generateSession } from '../../../utils/session.js';
import logger from '@core/logger';

export const signUpHandler = publicProcedure
  .input(signUpSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user with the same email already exists
    const existingUser =
      await ctx.prismaManager?.rootPrismaClient.employee.findUnique({
        where: {
          email: input.email,
        },
      });

    if (existingUser) {
      // Throw an error if email is already taken
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: ctx.t?.('res:auth.sign_up.email_taken', {
          email: input.email,
        }),
      });
    }

    // Create a new employee record
    const employee = await ctx.prismaManager?.rootPrismaClient.employee.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        pwHash: await hash(input.password, 10),
        language: {
          connectOrCreate: {
            where: {
              name: input.language,
            },
            create: {
              name: input.language,
            },
          },
        },
      },
    });

    if (!employee) {
      // Throw an error if employee creation failed
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: ctx.t?.('res:auth.sign_up.failed'),
      });
    }

    // Generate a session for the newly created employee
    const { accessToken } = await generateSession(ctx, {
      id: employee.id,
      currentOrganization: null,
    });

    logger.info({ employeeId: employee.id }, 'Employee signed up');
    // Return success message and access token
    return {
      message: ctx.t?.('res:auth.sign_up.success', {
        email: input.email,
      }),
      accessToken,
    };
  });
