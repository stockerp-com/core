import { z } from 'zod';

export const addSchema = z.object({
  name: z
    .string({
      required_error: 'errors:validation.required',
    })
    .min(1, 'errors:validation.min?count=1')
    .max(250, 'errors:validation.max?count=255'),
  description: z.string().optional(),
});

export type AddInput = z.infer<typeof addSchema>;
