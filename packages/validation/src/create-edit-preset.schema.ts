import { z } from 'zod';

export const crudString = z
  .string({
    required_error: 'errors:validation.required',
  })
  .min(1, 'errors:validation.min?count=1')
  .max(191, 'errors:validation.max?count=191');

export const crudEmail = z
  .string({
    required_error: 'errors:validation.required',
  })
  .email({
    message: 'errors:validation.email',
  });

export const crudFile = z.object({
  name: z.string(),
  key: z.string(),
  size: z.number(),
  type: z.string(),
});
