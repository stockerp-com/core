import { authenticatedProcedure } from '../../../procedures/authenticated.js';

export const findCurrentHandler = authenticatedProcedure.query(
  async ({ ctx }) => {
    const id = ctx.session?.organizationId;
    if (!id) {
      return {
        organization: null,
      };
    }

    const organization = await ctx.db?.organization.findUnique({
      where: {
        id,
      },
    });
    if (!organization) {
      return {
        error: {
          code: 'NOT_FOUND',
          message: ctx.t?.('res:organization.find_one.not_found', {
            id,
          }),
        },
      };
    }

    return {
      organization,
      message: ctx.t?.('res:organization.find_one.success', {
        id,
      }),
    };
  },
);
