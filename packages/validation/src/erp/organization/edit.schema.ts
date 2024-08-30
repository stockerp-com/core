import { z } from 'zod';
import { stringField } from '../../utils/common.js';

export const editOrganizationSchema = z.object({
  id: z.number(),
  name: stringField,
  description: z.string().optional(),
});

export type EditOrganizationInput = z.infer<typeof editOrganizationSchema>;
