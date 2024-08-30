import { z } from 'zod';
import { emailField } from '../../utils/common.js';

export const signInSchema = z.object({
  email: emailField,
  password: z.string({
    required_error: 'errors:validation.required',
  }),
});

export type SignInInput = z.infer<typeof signInSchema>;
