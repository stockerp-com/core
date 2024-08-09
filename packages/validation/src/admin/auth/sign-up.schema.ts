import { z } from 'zod';

export const signUpSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string(),
  preferredLanguage: z.enum(['EN', 'RU', 'UA']),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
