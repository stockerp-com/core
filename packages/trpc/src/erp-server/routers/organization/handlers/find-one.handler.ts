import { findOneSchema } from '@retailify/validation/erp/organization/find-one.schema';
import { authenticatedProcedure } from '../../../procedures/authenticated.js';

export const findOneHandler = authenticatedProcedure
  .input(findOneSchema)
  .query(async ({ ctx, input }) => {
    const organization = await ctx.db?.organization.findUnique({
      where: {
        id: input.id,
      },
    });
    if (!organization) {
      return {
        error: {
          code: 'NOT_FOUND',
          message: ctx.t?.('res:organization.find_one.not_found', {
            id: input.id,
          }),
        },
      };
    }

    return {
      organization,
      message: ctx.t?.('res:organization.find_one.success', {
        id: input.id,
      }),
    };
  });
