import { z } from 'zod';

export const archiveStockpointSchema = z.object({
  id: z.number(),
});

export type ArchiveStockpointInput = z.infer<typeof archiveStockpointSchema>;
