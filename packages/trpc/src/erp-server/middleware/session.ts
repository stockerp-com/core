import { TRPCError } from '@trpc/server';
import { middleware } from '../trpc.js';
import { verifyAT } from '../utils/jwt.js';
import jwt from 'jsonwebtoken';
import { EmployeeRoles } from '@core/constants/employee';

export const ensureSession = middleware(async ({ ctx, next }) => {
  const at = ctx.getAT?.();
  if (!at) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: ctx.t?.('errors:http.401'),
    });
  }

  try {
    const session = verifyAT(at);

    return next({
      ctx: {
        ...ctx,
        session,
      },
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: ctx.t?.('errors:http.401'),
      });
    } else {
      console.error('An error occurred:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: ctx.t?.('errors:http.other'),
      });
    }
  }
});

export const ensureTenant = (allowedRoles: EmployeeRoles) =>
  middleware(async ({ ctx, next }) => {
    const orgId = ctx.session?.currentOrganization?.id;
    const roles = ctx.session?.currentOrganization?.role;

    if (
      !orgId ||
      !roles ||
      !roles.some((role) => allowedRoles.includes(role))
    ) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: ctx.t?.('errors:http.401'),
      });
    }

    const tenantDb = await ctx.prismaManager?.getClient(orgId);

    return next({
      ctx: {
        ...ctx,
        tenantDb,
      },
    });
  });
