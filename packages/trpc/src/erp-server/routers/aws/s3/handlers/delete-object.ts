import { TRPCError } from '@trpc/server';
import { tenantProcedure } from '../../../../procedures/tenant.js';
import { deleteObjectSchema } from '@core/validation/erp/aws/s3/delete-object.schema';

export const deleteObjectHandler = tenantProcedure(['ADMIN', 'OWNER'])
  .input(deleteObjectSchema)
  .mutation(async ({ ctx, input }) => {
    if (input.key.startsWith('/System')) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'errors:http:403',
      });
    }
    if (input.key.startsWith('/Tenants')) {
      const tenantId = ctx.session?.currentOrganization?.id;
      if (!tenantId || !input.key.includes(`/Tenants/${tenantId}`)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'errors:http:403',
        });
      }
    }
    if (
      input.key.startsWith('/Shared') &&
      !input.key.startsWith('/Shared/Employees/Avatars')
    ) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'errors:http:403',
      });
    }
  });
