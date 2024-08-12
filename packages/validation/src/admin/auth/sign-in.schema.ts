import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string({
      required_error: 'errors:validation.required',
    })
    .email({
      message: 'errors:validation.email',
    }),
  password: z.string({
    required_error: 'errors:validation.required',
  }),
});

export type SignInInput = z.infer<typeof signInSchema>;
