import { z } from 'zod';
import { S3_PATHS } from '@core/constants/s3';

export const presignPutUrlSchema = z.object({
  path: z.enum(S3_PATHS, {
    required_error: 'erros:validation.required',
    invalid_type_error: 'errors:validation.invalidType',
  }),
  categoryId: z.number().optional(),
  goodId: z.number().optional(),
  tenantId: z.number().optional(),
});

export const PresignPutUrlInput = z.infer<typeof presignPutUrlSchema>;
