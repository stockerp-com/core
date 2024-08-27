import { z } from 'zod';
import { crudString } from '../../create-edit-preset.schema.js';

export const addOrganizationSchema = z.object({
  name: crudString,
  description: z.string().optional(),
});

export type AddOrganizationSchema = z.infer<typeof addOrganizationSchema>;
