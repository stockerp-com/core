import { z } from 'zod';

export const signUpSchema = z.object({
  fullName: z
    .string({
      required_error: 'errors:validation.required',
    })
    .min(1, 'errors:validation.min?count=8')
    .max(250, 'errors:validation.max?count=250'),
  email: z
    .string({
      required_error: 'errors:validation.required',
    })
    .email({
      message: 'errors:validation.email',
    }),
  password: z
    .string({
      required_error: 'errors:validation.required',
    })
    .refine((value) => {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isLongEnough = value.length >= 12;
      return (
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar &&
        isLongEnough
      );
    }, 'errors:validation.password'),
  preferredLanguage: z.string(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
