import { tenantProcedure } from '../../../procedures/tenant.js';

export const addHandler = tenantProcedure(['ADMIN', 'OWNER']);
