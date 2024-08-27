import { z } from 'zod';

export const deleteOrganizationSchema = z.object({
  id: z.number(),
});

export type DeleteOrganizationInput = z.infer<typeof deleteOrganizationSchema>;
