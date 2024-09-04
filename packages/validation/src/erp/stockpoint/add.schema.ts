import { z } from 'zod';
import { stringField } from '../../utils/common.js';

export const addStockpointSchema = z.object({
  name: stringField,
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  coordinates: z.string().optional(),
});

export type AddStockpointInput = z.infer<typeof addStockpointSchema>;
