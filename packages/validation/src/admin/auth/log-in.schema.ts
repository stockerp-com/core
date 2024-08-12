import { z } from 'zod';

export const logInSchema = z.object({
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
});

export type LogInInput = z.infer<typeof logInSchema>;
