import { z } from 'zod';
import { emailField, passwordField, stringField } from '../../utils/common.js';

export const signUpSchema = z.object({
  fullName: stringField,
  email: emailField,
  password: passwordField,
  preferredLanguage: z.string(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
