import { z } from 'zod';

const shared = z.object({
  search: z.string().optional(),
});

export const presetfindManyInfiniteSchema = z.object({
  ...shared.shape,
  limit: z.number().min(1).max(10).default(10),
  cursor: z.number().nullish(),
});
export const presetfindManySchema = z.object({
  ...shared.shape,
});
export const orderByField = z.enum(['asc', 'desc']).optional();

export type PresetfindManyInfiniteInput = z.infer<
  typeof presetfindManyInfiniteSchema
>;
export type PresetfindManyInput = z.infer<typeof presetfindManySchema>;
