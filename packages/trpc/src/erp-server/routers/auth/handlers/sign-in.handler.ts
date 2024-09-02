import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../procedures/public.js';
import { compare } from 'bcrypt';
import { signInSchema } from '@core/validation/erp/auth/sign-in.schema';
import { generateSession } from '../../../utils/session.js';
import { Context } from '../../../context.js';
import { Employee } from '@core/db';
import { EmployeeSession } from '@core/constants/employee';
import logger from '@core/logger';

// Helper function to generate session and return response
const generateResponse = async (
  ctx: Context,
  employee: Employee,
  currentOrganization: EmployeeSession['currentOrganization'],
) => {
  const { accessToken } = await generateSession(ctx, {
    id: employee.id,
    currentOrganization,
  });

  return {
    message: ctx.t?.('res:auth.sign_in.success', {
      email: employee.email,
    }),
    accessToken,
  };
};

export const signInHandler = publicProcedure
  .input(signInSchema)
  .mutation(async ({ ctx, input }) => {
    // Find employee by email
    const employee =
      await ctx.prismaManager?.rootPrismaClient?.employee.findUnique({
        where: {
          email: input.email,
        },
      });

    // If employee not found, throw error
    if (!employee) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: ctx.t?.('res:auth.sign_in.invalid_email', {
          email: input.email,
        }),
      });
    }

    // Validate password
    const validPassword = await compare(input.password, employee.pwHash);
    if (!validPassword) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: ctx.t?.('res:auth.sign_in.invalid_password'),
      });
    }

    // Check if employee has a current organization
    if (employee.currentOrganizationId) {
      const member =
        await ctx.prismaManager?.rootPrismaClient?.employeeToOrganization.findUnique(
          {
            where: {
              organizationId_employeeId: {
                organizationId: employee.currentOrganizationId,
                employeeId: ctx.session!.id,
              },
            },
          },
        );

      // If employee is not a member of the organization, generate session without organization
      if (!member) {
        logger.info(
          { employeeId: employee.id, organizationId: null },
          'Employee signed in',
        );
        return generateResponse(ctx, employee, null);
      }

      logger.info(
        {
          employeeId: employee.id,
          organizationId: employee.currentOrganizationId,
          role: member.role,
        },
        'Employee signed in',
      );
      // Generate session with organization details
      return generateResponse(ctx, employee, {
        id: employee.currentOrganizationId,
        role: member.role,
      });
    } else {
      // Generate session without organization
      return generateResponse(ctx, employee, null);
    }
  });
