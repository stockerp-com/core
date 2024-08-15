import { authenticatedProcedure } from '../../../procedures/authenticated.js';

export const findMeHandler = authenticatedProcedure.query(async ({ ctx }) => {
  const employee = await ctx.db?.employee.findUnique({
    where: {
      id: ctx.session?.id,
    },
    include: {
      picture: true,
    },
  });
  if (!employee) {
    return {
      error: {
        code: 'NOT_FOUND',
        message: ctx.t?.('res:employee.find_one.not_found', {
          id: ctx.session?.id,
        }),
      },
    };
  }

  const data: Partial<typeof employee> = employee;
  delete data.pwHash;

  return {
    employee: data,
    message: ctx.t?.('res:employee.find_one.success', {
      id: ctx.session?.id,
    }),
  };
});
