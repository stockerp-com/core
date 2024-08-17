import { z } from 'zod';

export const useSchema = z.object({
  organizationId: z.number(),
});

export type UseInput = z.infer<typeof useSchema>;
