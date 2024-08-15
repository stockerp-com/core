import { z } from 'zod';

export const findOneSchema = z.object({
  id: z.number({
    required_error: 'errors:validation.required',
  }),
});

export type FindOneInput = z.infer<typeof findOneSchema>;
