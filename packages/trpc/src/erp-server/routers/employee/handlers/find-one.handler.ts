import { authenticatedProcedure } from '../../../procedures/authenticated.js';
import { findOneSchema } from '@retailify/validation/erp/employee/find-one.schema';

export const findOneHandler = authenticatedProcedure
  .input(findOneSchema)
  .query(async ({ ctx, input }) => {
    const employee = await ctx.db?.employee.findUnique({
      where: {
        id: input.id,
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
            id: input.id,
          }),
        },
      };
    }

    const data: Partial<typeof employee> = employee;
    delete data.pwHash;

    return {
      employee: data,
      message: ctx.t?.('res:employee.find_one.success', {
        id: input.id,
      }),
    };
  });
