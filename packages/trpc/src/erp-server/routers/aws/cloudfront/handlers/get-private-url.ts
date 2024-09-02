import { tenantProcedure } from '../../../../procedures/tenant.js';
import { getPrivateUrlSchema } from '@core/validation/erp/aws/cloudfront/get-private-url.schema';

export const getPrivateUrlHandler = tenantProcedure(['OWNER', 'ADMIN'])
  .input(getPrivateUrlSchema)
  .query(async ({ ctx }) => {
    return ctx.aws?.cloudFront.getPrivateUrl({ key: '' });
  });
