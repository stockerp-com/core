import { z } from 'zod';
import { stringField } from '../../utils/common.js';
export const addOrganizationSchema = z.object({
  name: stringField,
  description: z.string().optional(),
});

export type AddOrganizationSchema = z.infer<typeof addOrganizationSchema>;
