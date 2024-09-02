import { z } from 'zod';
import { stringField } from '../../../utils/common.js';

export const getPrivateUrlSchema = z.object({
  key: stringField,
});

export type GetPrivateUrlInput = z.infer<typeof getPrivateUrlSchema>;
