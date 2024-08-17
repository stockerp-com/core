import { z } from 'zod';

export const findAllInfiniteSchema = z.object({
  limit: z.number().min(1).max(10).default(10),
  cursor: z.number().nullish(),
  search: z.string().optional(),
});

export type FindAllInfiniteInput = z.infer<typeof findAllInfiniteSchema>;
