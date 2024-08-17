import { z } from 'zod';

export const presignPutUrlSchema = z.object({
  dir: z.enum(['Export', 'Import', 'Media', 'Profile_Pictures']),
});

export type PresignPutUrlInput = z.infer<typeof presignPutUrlSchema>;
