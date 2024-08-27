import { z } from 'zod';
import { crudString } from '../../create-edit-preset.schema.js';

export const editOrganizationSchema = z.object({
  id: z.number(),
  name: crudString,
  description: z.string().optional(),
});

export type EditOrganizationInput = z.infer<typeof editOrganizationSchema>;
