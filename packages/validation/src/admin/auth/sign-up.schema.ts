import { z } from 'zod';

export const signUpSchema = z.object({
  fullName: z.string({
    required_error: 'validation:errors.required_field',
  }),
  email: z
    .string({
      required_error: 'validation:errors.required_field',
    })
    .email({
      message: 'validation:errors.invalid_email',
    }),
  password: z.string({
    required_error: 'validation:errors.required_field',
  }),
  preferredLanguage: z.enum(['EN', 'RU', 'UA']),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
