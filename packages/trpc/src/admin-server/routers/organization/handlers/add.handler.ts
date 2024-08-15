import { authenticatedProcedure } from '../../../procedures/authenticated.js';
import { addSchema } from '@retailify/validation/admin/organization/add.schema';

export const addHandler = authenticatedProcedure
  .input(addSchema)
  .mutation(async ({ ctx, input }) => {
    return await ctx.db?.organization.create({
      data: {
        name: input.name,
        description: input.description,
        staff: {
          create: {
            employeeId: ctx.session!.id,
            role: 'ORGANIZATION_ADMIN',
          },
        },
      },
    });
  });
