import { z } from 'zod';

export const findOneStockpointSchema = z.object({
  id: z.number(),
});

export type FindOneStockpointInput = z.infer<typeof findOneStockpointSchema>;
