import { z } from 'zod';

export const deleteObjectSchema = z.object({
  key: z.string(),
});

export const DeleteObjectInput = z.infer<typeof deleteObjectSchema>;
